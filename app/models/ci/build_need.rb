# frozen_string_literal: true

module Ci
  class BuildNeed < Ci::ApplicationRecord
    include Ci::Partitionable
    include BulkInsertSafe
    include IgnorableColumns

    ignore_column :id_convert_to_bigint, remove_with: '16.4', remove_after: '2023-09-22'

    belongs_to :build, class_name: "Ci::Processable", foreign_key: :build_id, inverse_of: :needs

    partitionable scope: :build

    validates :build, presence: true
    validates :name, presence: true, length: { maximum: 128 }
    validates :optional, inclusion: { in: [true, false] }

    scope :scoped_build, -> { where("#{Ci::Build.quoted_table_name}.id = #{quoted_table_name}.build_id") }
    scope :artifacts, -> { where(artifacts: true) }
  end
end
