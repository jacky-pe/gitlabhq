# frozen_string_literal: true

module API
  module Helpers
    module Packages
      module Npm
        include Gitlab::Utils::StrongMemoize
        include ::API::Helpers::PackagesHelpers

        NPM_ENDPOINT_REQUIREMENTS = {
          package_name: API::NO_SLASH_URL_PART_REGEX
        }.freeze

        def project
          case endpoint_scope
          when :project
            user_project(action: :read_package)
          when :instance, :group
            # Simulate the same behavior as #user_project by re-using #find_project!
            # but take care if the project_id is nil as #find_project! is not designed
            # to handle it.
            project_id = project_id_or_nil

            not_found!('Project') unless project_id

            find_project!(project_id)
          end
        end
        strong_memoize_attr :project

        def finder_for_endpoint_scope(package_name)
          case endpoint_scope
          when :project
            ::Packages::Npm::PackageFinder.new(package_name, project: project_or_nil)
          when :instance
            ::Packages::Npm::PackageFinder.new(package_name, namespace: top_namespace_from(package_name))
          when :group
            ::Packages::Npm::PackageFinder.new(package_name, namespace: group)
          end
        end

        def project_or_nil
          # mainly used by the metadata endpoint where we need to get a project
          # and return nil if not found (no errors should be raised)
          return unless project_id_or_nil

          find_project(project_id_or_nil)
        end
        strong_memoize_attr :project_or_nil

        def project_id_or_nil
          case endpoint_scope
          when :project
            params[:id]
          when :group
            finder = ::Packages::Npm::PackageFinder.new(
              params[:package_name],
              namespace: group
            )

            finder.last&.project_id
          when :instance
            package_name = params[:package_name]

            namespace =
              if Feature.enabled?(:npm_allow_packages_in_multiple_projects)
                top_namespace_from(package_name)
              else
                namespace_path = ::Packages::Npm.scope_of(package_name)
                return unless namespace_path

                Namespace.top_most.by_path(namespace_path)
              end

            return unless namespace

            finder = ::Packages::Npm::PackageFinder.new(
              package_name,
              namespace: namespace
            )

            finder.last&.project_id
          end
        end
        strong_memoize_attr :project_id_or_nil

        def enqueue_sync_metadata_cache_worker(project, package_name)
          return unless Feature.enabled?(:npm_metadata_cache, project)

          ::Packages::Npm::CreateMetadataCacheWorker.perform_async(project.id, package_name)
        end

        private

        def top_namespace_from(package_name)
          namespace_path = ::Packages::Npm.scope_of(package_name)
          return unless namespace_path

          Namespace.top_most.by_path(namespace_path)
        end

        def group
          group = find_group(params[:id])
          not_found!('Group') unless can?(current_user, :read_group, group)
          group
        end
        strong_memoize_attr :group
      end
    end
  end
end
