import { makeAutoObservable } from 'mobx';

/**
 * RootStore - Main MobX store that aggregates all domain stores
 *
 * Example usage:
 * const rootStore = new RootStore();
 * const { someStore } = rootStore;
 */
export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  // Add your domain stores here
  // Example:
  // userStore = new UserStore(this);
  // authStore = new AuthStore(this);
}
