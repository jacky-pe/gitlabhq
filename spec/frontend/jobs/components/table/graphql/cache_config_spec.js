import cacheConfig from '~/jobs/components/table/graphql/cache_config';
import {
  CIJobConnectionExistingCache,
  CIJobConnectionIncomingCache,
  CIJobConnectionIncomingCacheRunningStatus,
} from '../../../mock_data';

const firstLoadArgs = { first: 3, statuses: 'PENDING' };
const runningArgs = { first: 3, statuses: 'RUNNING' };

describe('jobs/components/table/graphql/cache_config', () => {
  describe('when fetching data with the same statuses', () => {
    it('should contain cache nodes and a status when merging caches on first load', () => {
      const res = cacheConfig.typePolicies.CiJobConnection.merge({}, CIJobConnectionIncomingCache, {
        args: firstLoadArgs,
      });

      expect(res.nodes).toHaveLength(CIJobConnectionIncomingCache.nodes.length);
      expect(res.statuses).toBe('PENDING');
    });

    it('should add to existing caches when merging caches after first load', () => {
      const res = cacheConfig.typePolicies.CiJobConnection.merge(
        CIJobConnectionExistingCache,
        CIJobConnectionIncomingCache,
        {
          args: firstLoadArgs,
        },
      );

      expect(res.nodes).toHaveLength(
        CIJobConnectionIncomingCache.nodes.length + CIJobConnectionExistingCache.nodes.length,
      );
    });
  });

  describe('when fetching data with different statuses', () => {
    it('should reset cache when a cache already exists', () => {
      const res = cacheConfig.typePolicies.CiJobConnection.merge(
        CIJobConnectionExistingCache,
        CIJobConnectionIncomingCacheRunningStatus,
        {
          args: runningArgs,
        },
      );

      expect(res.nodes).not.toEqual(CIJobConnectionExistingCache.nodes);
      expect(res.nodes).toHaveLength(CIJobConnectionIncomingCacheRunningStatus.nodes.length);
    });
  });
});
