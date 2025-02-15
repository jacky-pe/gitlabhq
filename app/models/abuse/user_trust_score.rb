# frozen_string_literal: true

module Abuse
  class UserTrustScore
    def initialize(user)
      @user = user
    end

    def spammer?
      spam_score > Abuse::TrustScore::SPAMCHECK_HAM_THRESHOLD
    end

    def spam_score
      user_scores.spamcheck.average(:score) || 0.0
    end

    def telesign_score
      user_scores.telesign.order_created_at_desc.first&.score || 0.0
    end

    def arkose_global_score
      user_scores.arkose_global_score.order_created_at_desc.first&.score || 0.0
    end

    def arkose_custom_score
      user_scores.arkose_custom_score.order_created_at_desc.first&.score || 0.0
    end

    def trust_scores_for_source(source)
      user_scores.where(source: source)
    end

    private

    def user_scores
      Abuse::TrustScore.where(user_id: @user.id)
    end
  end
end
