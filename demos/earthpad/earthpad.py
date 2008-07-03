#!/usr/bin/env python
#
# Copyright 2008 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
#
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__author__ = 'cnygaard@google.com (Carl Nygaard)'

import cgi
import datetime
import logging
import random
import time
import wsgiref.handlers
from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

PRODUCTION_HOSTNAME = 'earthpad.appspot.com'
STAGING_HOSTNAME = 'earthpad.prom.corp.google.com'
DEBUG_HOSTNAME = 'gorgar.kir.corp.google.com'

API_KEYS = {PRODUCTION_HOSTNAME:
            ('ABQIAAAAwbkbZLyhsmTCWXbTcjbgbRQBG8cc0S7b5SA6aIkXMa1U6T-V0hQymUHyz'
             'hIRKDHAyaKCzzlpNqRIOw'),
            STAGING_HOSTNAME: 
            ('ABQIAAAAVqIP_JQh0O0nvjijuZBcURTJwZ-NLfjZXzvx0gjxB6pbYFPWLBTcaONMF'
             'p8DO9Ylu1R5T47YXLl9bA'),
            DEBUG_HOSTNAME:
            ('ABQIAAAAVqIP_JQh0O0nvjijuZBcURQtuArS5cNtRkPopVjg4JQEPJ5LsxSTz9mbJ'
             'UxvS0fDPd1Ut_F-AsVdZQ'),
           }

XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n'
# TODO(cnygaard): Remove KML wrapper since it no longer has meaning.
KML_HEADER = (XML_HEADER +
              '<kml xmlns="http://earth.google.com/kml/2.1">\n')
KML_FOOTER = '</kml>\n'

# The lifetime of a volitile revision.  During an update, those volitile
# revisions older than this length of time will be deleted.
MAX_VOLITILE_REVISION_LIFE = 60  # 60 seconds


def InProduction(hostname):
  """Says whether the given hostname is the production hostname.
  
  This is not foolproof and shouldn't be used in places where security matters.
  """
  return hostname.startswith(PRODUCTION_HOSTNAME)


def GetMapsAPIKey(hostname):
  """The api key depends on the hostname of the server being run on."""
  # Strip out the port if there is one:
  if ':' in hostname:
    hostname = hostname.split(':')[0]

  if hostname in API_KEYS:
    return API_KEYS[hostname]
  else:
    logging.warning('API Key not found for host %s.' % hostname)
    return API_KEYS[DEBUG_HOSTNAME]


class EarthPadAbstractRequestHandler(webapp.RequestHandler):
  """Provide generic support to handle user authentication, etc."""

  def GetNickName(self):
    """Returns the current user's id, or None if there isn't one."""
    user = users.get_current_user()
    if not user:
      return None
    return user.nickname()

  def RedirectToLogin(self):
    self.redirect(users.create_login_url(self.request.uri))


class InteractivePage(EarthPadAbstractRequestHandler):
  """The primary page through which users interact with earth pad."""

  def get(self):
    nick = self.GetNickName()
    if not nick:
      # Require all users to be logged in.
      self.RedirectToLogin()
      return

    id = self.request.get('id')
    if not id:
      # If the id is is not provide, create a new page by default.
      self.redirect('/')
      return

    # Extract whether we are in debug mode. The default depends on whether we
    # are in production.
    hostname = self.request.headers.get('host')
    debug_mode = self.request.get('d', str(not InProduction(hostname)))
    if debug_mode.upper() in ['1', 'TRUE']:
      debug_mode = True
    else:
      debug_mode = False

    # If the user tries to request a document that doesn't exist, send a
    # friendly error message.
    doc = Document.get_by_key_name(id)
    # NOTE(cnygaard): I'm worried about race conditions where the document may
    # not show up in all replicas before the redirection from / completes.
    if not doc:
      self.error(404)
      self.response.out.write(
          'Earth Pad not found.  Try <a href="/">creating a new one</a>!')
      return

    main_props = {
        'id': id,
        'debug_mode': debug_mode,
        'maps_api_key': GetMapsAPIKey(hostname),
        'nick': nick,
        'docurl': 'http://%s/interact?id=%s' % (hostname, id),
        'doctitle': doc.title or 'Untitled',
    }

    self.response.out.write(template.render('main.html', main_props))
    

class Document(db.Model):
  """Global properties for a single document."""

  # The key name for the document is set to make a unique document.

  # This value is used as a lock through transactional modifications to
  # gaurantee that no two users can make a modification w/ the same rev number.
  latest_revision_number = db.IntegerProperty(required=True)

  # There is at least one lookat, and in order to retain it, we should remember
  # which revision contains that lookat
  latest_lookat_revision_number = db.IntegerProperty()

  # The title of the document.  Expected to be low traffic in terms of the
  # number of changes, so we can afford to store it here and additionally give
  # it a volatile revision.
  title = db.StringProperty()

  @staticmethod
  def IncrementRevisionNumber(key_name, is_lookat):
    """Increment the given document's revision number.

    Args:
      key_name: The key to finding the document.
      is_lookat: Says whether to also update the latest_lookat_revision_number.

    Returns:
      Tuple of acquired revision number and latest_lookat_revision_number.
    """
    doc = Document.get_by_key_name(key_name)
    doc.latest_revision_number += 1
    if is_lookat:
      doc.latest_lookat_revision_number = doc.latest_revision_number
    doc.put()
    return (doc.latest_revision_number, doc.latest_lookat_revision_number)


class Revision(db.Model):
  """A single revision to a document."""

  # These two values act together as primary key.
  document_id = db.StringProperty(required=True)
  revision_number = db.IntegerProperty(required=True)
  # The user that made this modification.
  nickname = db.StringProperty(required=True)

  timestamp = db.IntegerProperty(required=True)

  # Each property below is optional. Typically in a single revision only one
  # property is present.

  # Used when the view changes
  new_look_at = db.IntegerProperty()

  # The message log contains plain text entries to be shown in the message box.
  # This could include chat messages or sign in/out notifications.
  message_log = db.StringProperty()

  # Map contents authoring
  added_placemark = db.IntegerProperty()
  removed_placemark = db.IntegerProperty()

  # The document also holds the current title, so this revision is volatile.
  new_title = db.StringProperty()

  def IsVolatile(self):
    """Returns true if the type of this revision is safe to delete."""
    # Only added_placemarks are not volatile.
    return self.added_placemark is None


class KmlLookAt(db.Model):
  """A data structure pertaining to the look at object."""

  latitude = db.FloatProperty(required=True)
  longitude = db.FloatProperty(required=True)
  range = db.FloatProperty(required=True)
  tilt = db.FloatProperty(required=True)
  heading = db.FloatProperty(required=True)
  altitude = db.FloatProperty(required=True)
  altitude_mode = db.IntegerProperty(required=True)
  _ALTITUDE_MODE_ENUM = {0: 'clampToGround',
                         1: 'relativeToGround',
                         2: 'absolute'}

  def ToXML(self):
    """Returns an XML representation."""
    return '\n'.join([
        '<LookAt>',
        '  <longitude>%f</longitude>' % self.longitude,
        '  <latitude>%f</latitude>' % self.latitude,
        '  <altitude>%f</altitude>' % self.altitude,
        '  <range>%f</range>' % self.range,
        '  <tilt>%f</tilt>' % self.tilt,
        '  <heading>%f</heading>' % self.heading,
        '  <altitudeMode>%s</altitudeMode>' % (
            self._ALTITUDE_MODE_ENUM[self.altitude_mode]),
        '</LookAt>'])


class KmlPlacemark(db.Model):
  """A simple placemark."""

  latitude = db.FloatProperty(required=True)
  longitude = db.FloatProperty(required=True)
  note = db.StringProperty()

  def ToXML(self):
    """Returns an XML representation."""
    return '\n'.join([
        '<add_placemark>',
        '  <placemark_id>%d</placemark_id>' % self.key().id(),
        '  <longitude>%f</longitude>' % self.longitude,
        '  <latitude>%f</latitude>' % self.latitude,
        '  <note>%s</note>' % self.note,
        '</add_placemark>',
      ])


ID_LENGTH = 5
def GenerateRandomPageId():
  """Creates a likely-unique random page ID."""
  # TODO(cnygaard): Improve this hashing to assure no collisions occur
  return ''.join([chr(random.randint(65,65+25)) for _ in range(ID_LENGTH)])


class UpdateCheck(EarthPadAbstractRequestHandler):
  """Handler for requests for ajax update check requests."""

  def post(self):
    id = self.request.get('id')
    last_known_revision = int(self.request.get('last_known_revision', -1))
    logging.info('update check for %s' % id)
    error_status = 0

    if not id:
      self.error(404)
      return

    # This is the ideal query.  It does not seem to work in production.
    # Instead, not only are all the appropriate values returned, so too are all
    # other revisions whose document_id is alphabetically after the given id.
    # q = db.GqlQuery('SELECT * FROM Revision '
    #                 'WHERE document_id = :1 '
    #                 '  AND revision_number > :2 '
    #                 'ORDER BY revision_number',
    #                 id, last_known_revision)
    q = db.GqlQuery('SELECT * FROM Revision '
                    'WHERE document_id = :1 '
                    'ORDER BY revision_number',
                    id)

    self.response.out.write(KML_HEADER)

    # We should send only one lookat update per request to save effort and data.
    latest_lookat_xml = None

    num_invalid_revisions = 0
    total_revs = 0
    for revision in q:
      total_revs += 1
      if revision.document_id != id:
        num_invalid_revisions += 1
        continue

      # We must do this manual filtering to get over the limitation above.
      if revision.revision_number <= last_known_revision:
        continue

      last_known_revision = revision.revision_number
      revision_tag = '<revision nickname="%s" revision_number="%d" >' % (
          revision.nickname, revision.revision_number)

      def WrapInRevision(output):
        """Wraps the given output in the appropriate revision node."""
        return '%s%s</revision>' % (revision_tag, output)

      if revision.new_look_at:
        look_at = KmlLookAt.get_by_id(revision.new_look_at)
        if look_at:
          latest_lookat_xml = WrapInRevision(look_at.ToXML())
      if revision.message_log:
        self.response.out.write(WrapInRevision(
            '<message>%s</message>' % cgi.escape(revision.message_log)))
      if revision.added_placemark:
        placemark = KmlPlacemark.get_by_id(revision.added_placemark)
        if placemark:
          self.response.out.write(WrapInRevision(placemark.ToXML()))
      if revision.removed_placemark:
        placemark = KmlPlacemark.get_by_id(revision.removed_placemark)
        self.response.out.write(WrapInRevision(
            '<remove_placemark placemark_id="%d" />'
            % revision.removed_placemark))
      if revision.new_title:
        self.response.out.write(WrapInRevision(
            '<new_title>%s</new_title>' % cgi.escape(revision.new_title)))

    if num_invalid_revisions:
      logging.error('Request for document %s retrieved %s incorrect revisions.'
                    % (id, num_invalid_revisions))
    if latest_lookat_xml:
      self.response.out.write(latest_lookat_xml)
    # Let the client know what the current revision number is.
    logging.info('status: %s, revision: %s, total_revs: %d' % (
      error_status, last_known_revision, total_revs))
    self.response.out.write('<updatecheckresponse status="%d" revision="%d" />'
                            % (error_status, last_known_revision))
    self.response.out.write(KML_FOOTER)


def CleanUpOldRevisions(id, latest_revision_number,
                        latest_lookat_revision_number):
  """Clean up old volatile revision data.

  This is done during update sends rather than the more frequently occuring
  update check calls.

  Args:
    id: The doc id.
    latest_revision_number: The revision number being created.
  """
  q = db.GqlQuery('SELECT * FROM Revision '
                  'WHERE document_id = :1 '
                  'ORDER BY revision_number',
                  id)
  old_revisions_by_placemark_id = {}

  for revision in q:
    if revision.document_id != id:
      logging.error('Incorrect ID given!')
      continue

    # Added placemarks aren't volatile unless they are later deleted.  Store all
    # the old placemarks.
    if revision.added_placemark:
      old_revisions_by_placemark_id[revision.added_placemark] = revision

    if not revision.IsVolatile():
      continue
    if revision.revision_number == latest_revision_number:
      continue
    if int(time.time()) - revision.timestamp < MAX_VOLITILE_REVISION_LIFE:
      logging.info('Not deleting %d -- too young' % revision.revision_number)
      continue

    # We really want to make sure the revision of interest is deleted, no matter
    # whether its constituent parts get deleted, so wrap in a try-finally.
    really_delete = True
    try:
      if (revision.new_look_at and
          revision.revision_number != latest_lookat_revision_number):
        logging.info('Deleting look at %d' % revision.new_look_at)
        look_at = KmlLookAt.get_by_id(revision.new_look_at)
        if look_at:
          look_at.delete()
      elif revision.new_look_at:
        # There may be a number of reasons the above if block throws an error.
        # If there is a problem, we error on the side of destruction.  If no
        # problem, then here we prevent the deletion.
        logging.info('Not deleting only look at %d' % revision.revision_number)
        really_delete = False

      if revision.removed_placemark:
        logging.info('Deleting placemark %d' % revision.removed_placemark)
        KmlPlacemark.get_by_id(revision.removed_placemark).delete()
        # Get rid of the original placemark add.
        if revision.removed_placemark in old_revisions_by_placemark_id:
          old_rev = old_revisions_by_placemark_id[revision.removed_placemark]
          logging.info('Del placemark - rev %d.' % old_rev.revision_number)
          if old_rev:
            old_rev.delete()
    finally:
      if really_delete:
        logging.info('Deleting revision %d.' % revision.revision_number)
        revision.delete()


class UpdateSend(EarthPadAbstractRequestHandler):
  """Handler for ajax requests to send updates."""

  def post(self):
    id = self.request.get('id')
    type = self.request.get('type')
    logging.info('update send for %s' % id)
    error_status = 0
    nick = self.GetNickName()

    if not id or not type or not nick:
      self.error(404)
      return

    revision = Revision(document_id=id,
                        revision_number=-1,  # Set later.
                        nickname=nick,
                        timestamp=int(time.time()),
                       )
    logging.info('Processing update of type %s.' % type)
    if type == 'new_look_at':
      revision.new_look_at = self.ProcessNewLookAt()
    elif type == 'message_log':
      # Arbitrarily clip messages larger than 4k.
      revision.message_log = self.request.get('msg', '')[:4096]
      logging.info('Recieved new message_log.');
    elif type == 'add_placemark':
      revision.added_placemark = self.ProcessAddPlacemark()
    elif type == 'remove_placemark':
      revision.removed_placemark = int(self.request.get('placemark_id'))
    elif type == 'new_title':
      revision.new_title = self.request.get('title')
      doc = Document.get_by_key_name(id)
      doc.title = revision.new_title
      doc.put()

    # Use transactions to assure unique revision numbers.
    MAX_RETRIES = 10
    rev_num = -1
    for i in range(MAX_RETRIES):
      try:
        rev_num, lookat_rev_num = db.run_in_transaction(
            Document.IncrementRevisionNumber, id, type == 'new_look_at')
        break
      except db.Rollback, e:
        # When another process beat us out, try again.
        pass
    else:
      logging.warning('Unable to acquire revision after %d tries. Error: %s'
                      % (MAX_RETRIES, str(e)))
      error_status = 1

    # Finalize the revision by pushing it to the server.
    if not error_status:
      revision.revision_number = rev_num
      revision.put()

    self.response.out.write(XML_HEADER + 
                            '<updatesendresponse status="%d" revision="%d" />'
                            % (error_status, rev_num))

    CleanUpOldRevisions(id, rev_num, lookat_rev_num)

  def ProcessNewLookAt(self):
    """An update request to change the lookat.
    
    Returns:
      The ID of the new look at object to be added to the revision.
    """
    look_at = KmlLookAt(
      latitude = float(self.request.get('latitude')),
      longitude = float(self.request.get('longitude')),
      range = float(self.request.get('range')),
      tilt = float(self.request.get('tilt')),
      heading = float(self.request.get('heading')),
      altitude = float(self.request.get('altitude')),
      altitude_mode = int(self.request.get('altitude_mode'))
    )
    look_at.put()
    id = look_at.key().id()
    logging.info('View %s: New latitude: %f new long: %f'
                 % (id, look_at.latitude, look_at.longitude))
    return id

  def ProcessAddPlacemark(self):
    """An update request to add a placemark.
    
    Returns:
      The ID of the new placemark object to be added to the revision.
    """
    placemark = KmlPlacemark(
      latitude = float(self.request.get('latitude')),
      longitude = float(self.request.get('longitude')),
      note = self.request.get('note'),
    )
    placemark.put()
    id = placemark.key().id()
    logging.info('Placemark %s: New latitude: %f new long: %f'
                 % (id, placemark.latitude, placemark.longitude))
    return id


class MainPage(EarthPadAbstractRequestHandler):
  """Handler for / which creates a new document."""

  def get(self):
    nick = self.GetNickName()
    if not nick:
      self.RedirectToLogin()
      return

    # Make a new random page for the user.
    id = GenerateRandomPageId()
    new_doc = Document(key_name=id, latest_revision_number=-1)
    new_doc.put()
    self.redirect('/interact?id=%s' % id)


application = webapp.WSGIApplication([
  ('/', MainPage),
  ('/interact', InteractivePage),
  ('/updatecheck', UpdateCheck),
  ('/updatesend', UpdateSend),
], debug=True)  # debug=True says to print a stack trace.


def main():
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
