/**
 * Compatibility Layer for NotifyPlan Core
 * Handles version compatibility and payload migration
 */

export interface VersionInfo {
  major: number
  minor: number
  patch: number
  full: string
}

export interface CompatibilityResult {
  compatible: boolean
  requiresMigration: boolean
  migrationPath: string[]
  breaking: boolean
}

export class CompatibilityLayer {
  /**
   * Parse version string to VersionInfo
   */
  static parseVersion(version: string): VersionInfo {
    const [major, minor, patch] = version.split('.').map(Number)
    return {
      major: major || 0,
      minor: minor || 0,
      patch: patch || 0,
      full: version
    }
  }

  /**
   * Check if two versions are compatible
   * Same major version = compatible
   */
  static isCompatible(
    currentVersion: string,
    requiredVersion: string
  ): CompatibilityResult {
    const current = this.parseVersion(currentVersion)
    const required = this.parseVersion(requiredVersion)

    const compatible = current.major === required.major
    const breaking = current.major !== required.major
    const requiresMigration = !compatible || current.minor < required.minor

    // Calculate migration path
    const migrationPath: string[] = []
    if (current.major < required.major) {
      // Major version upgrade needed
      for (let i = current.major; i < required.major; i++) {
        migrationPath.push(`${i}.x.x → ${i + 1}.0.0`)
      }
    } else if (current.minor < required.minor) {
      // Minor version upgrade available
      migrationPath.push(`${current.full} → ${required.major}.${required.minor}.0`)
    }

    return {
      compatible,
      requiresMigration,
      migrationPath,
      breaking
    }
  }

  /**
   * Migrate payload between versions
   */
  static migratePayload(
    payload: any,
    fromVersion: string,
    toVersion: string
  ): any {
    const from = this.parseVersion(fromVersion)
    const to = this.parseVersion(toVersion)

    // Same version - no migration needed
    if (from.full === to.full) {
      return payload
    }

    let migrated = { ...payload }

    // Major version migrations
    if (from.major < to.major) {
      // Migrate from v1 to v2
      if (from.major === 1 && to.major === 2) {
        migrated = this.migrateV1ToV2(migrated)
      }
      // Add more major migrations as needed
    }

    // Minor version migrations
    if (from.major === to.major && from.minor < to.minor) {
      // Handle minor version migrations
      migrated = this.migrateMinorVersion(migrated, from, to)
    }

    return migrated
  }

  /**
   * Migrate from v1 to v2
   */
  private static migrateV1ToV2(payload: any): any {
    const migrated = { ...payload }

    // Example: Rename fields
    if (migrated.userId && !migrated.user_id) {
      migrated.user_id = migrated.userId
    }

    // Example: Add new required fields with defaults
    if (!migrated.priority) {
      migrated.priority = 'medium'
    }

    // Example: Transform data structure
    if (migrated.channels && Array.isArray(migrated.channels)) {
      // Ensure channels are in new format
      migrated.channels = migrated.channels.map((ch: string) => 
        ch.toLowerCase()
      )
    }

    return migrated
  }

  /**
   * Migrate minor version changes
   */
  private static migrateMinorVersion(
    payload: any,
    from: VersionInfo,
    to: VersionInfo
  ): any {
    const migrated = { ...payload }

    // Example: Add new optional fields
    if (!migrated.metadata) {
      migrated.metadata = {}
    }

    return migrated
  }

  /**
   * Validate payload against version requirements
   */
  static validatePayload(
    payload: any,
    version: string
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const v = this.parseVersion(version)

    // Version-specific validation
    if (v.major >= 2) {
      // v2+ requires userId
      if (!payload.userId && !payload.user_id) {
        errors.push('userId is required for v2+')
      }

      // v2+ requires priority
      if (!payload.priority) {
        errors.push('priority is required for v2+')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Get migration guide URL
   */
  static getMigrationGuide(
    fromVersion: string,
    toVersion: string
  ): string {
    const from = this.parseVersion(fromVersion)
    const to = this.parseVersion(toVersion)

    if (from.major < to.major) {
      return `https://docs.notifyplan.io/migration/${from.major}-to-${to.major}`
    } else if (from.minor < to.minor) {
      return `https://docs.notifyplan.io/changelog/${to.major}.${to.minor}`
    }

    return 'https://docs.notifyplan.io/changelog'
  }
}

