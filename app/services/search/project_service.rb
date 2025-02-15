# frozen_string_literal: true

module Search
  class ProjectService
    include Search::Filter
    include Gitlab::Utils::StrongMemoize
    include ProjectsHelper

    ALLOWED_SCOPES = %w(blobs issues merge_requests wiki_blobs commits notes milestones users).freeze

    attr_accessor :project, :current_user, :params

    def initialize(user, project_or_projects, params)
      @current_user = user
      @project = project_or_projects
      @params = params.dup
    end

    def execute
      Gitlab::ProjectSearchResults.new(current_user,
                                       params[:search],
                                       project: project,
                                       repository_ref: params[:repository_ref],
                                       order_by: params[:order_by],
                                       sort: params[:sort],
                                       filters: filters
                                      )
    end

    def allowed_scopes
      ALLOWED_SCOPES
    end

    def scope
      strong_memoize(:scope) do
        next params[:scope] if allowed_scopes.include?(params[:scope]) && project_search_tabs?(params[:scope].to_sym)

        allowed_scopes.find do |scope|
          project_search_tabs?(scope.to_sym)
        end
      end
    end
  end
end

Search::ProjectService.prepend_mod_with('Search::ProjectService')
