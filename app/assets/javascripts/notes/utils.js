import { marked } from 'marked';
import markedBidi from 'marked-bidi';
import { sanitize } from '~/lib/dompurify';
import { markdownConfig } from '~/lib/utils/text_utility';
import { HTTP_STATUS_UNPROCESSABLE_ENTITY } from '~/lib/utils/http_status';
import { sprintf } from '~/locale';
import { COMMENT_FORM } from './i18n';

/**
 * Tracks snowplow event when User toggles timeline view
 * @param {Boolean} enabled that will be send as a property for the event
 */
export const trackToggleTimelineView = (enabled) => ({
  category: 'Incident Management', // eslint-disable-line @gitlab/require-i18n-strings
  action: 'toggle_incident_comments_into_timeline_view',
  label: 'Status', // eslint-disable-line @gitlab/require-i18n-strings
  property: enabled,
});

marked.use(markedBidi());

export const renderMarkdown = (rawMarkdown) => {
  return sanitize(marked(rawMarkdown), markdownConfig);
};

export const getErrorMessages = (data, status) => {
  const errors = data?.errors;

  if (errors && status === HTTP_STATUS_UNPROCESSABLE_ENTITY) {
    if (errors.commands_only?.length) {
      return errors.commands_only;
    }

    return [sprintf(COMMENT_FORM.error, { reason: errors.toLowerCase() }, false)];
  }

  return [COMMENT_FORM.GENERIC_UNSUBMITTABLE_NETWORK];
};
