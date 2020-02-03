# frozen_string_literal: true

class PruneOldEventsWorker
  include ApplicationWorker
  include CronjobQueue

  feature_category_not_owned!

  DELETE_LIMIT = 10_000

  def perform
    # Contribution calendar shows maximum 12 months of events, we retain 3 years for data integrity.
    cutoff_date = (3.years + 1.day).ago

    Event.unscoped.created_before(cutoff_date).delete_with_limit(DELETE_LIMIT)
  end
end
