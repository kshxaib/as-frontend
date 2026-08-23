import { ProfileWorkspace } from "./profile";

/**
 * ProfileSettings — Phase 9 entry point.
 * The page now lives in `components/profile/*`
 * ("The Reading Room" control room).
 * All store actions, key-validation rules, and API contracts are
 * preserved unchanged; the security posture is identical (typed keys
 * live only in transient component state and are never persisted,
 * logged, or displayed after save).
 */
export const ProfileSettings = () => <ProfileWorkspace />;

export default ProfileSettings;
