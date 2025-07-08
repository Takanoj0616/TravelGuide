import { updateCrowdDataBatch } from './api/social-crowd-analyzer.js';

class CrowdDataScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  // スケジューラーを開始
  start(intervalMinutes: number = 15): void {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log(`Starting crowd data scheduler with ${intervalMinutes} minute intervals`);
    
    this.isRunning = true;
    this.intervalId = setInterval(async () => {
      try {
        console.log('Running scheduled crowd data update...');
        await updateCrowdDataBatch();
        console.log('Scheduled crowd data update completed');
      } catch (error) {
        console.error('Error in scheduled crowd data update:', error);
      }
    }, intervalMinutes * 60 * 1000);

    // 初回実行
    this.runInitialUpdate();
  }

  // スケジューラーを停止
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Crowd data scheduler stopped');
  }

  // 初回更新を実行
  private async runInitialUpdate(): Promise<void> {
    try {
      console.log('Running initial crowd data update...');
      await updateCrowdDataBatch();
      console.log('Initial crowd data update completed');
    } catch (error) {
      console.error('Error in initial crowd data update:', error);
    }
  }

  // 手動で更新を実行
  async runManualUpdate(): Promise<void> {
    try {
      console.log('Running manual crowd data update...');
      await updateCrowdDataBatch();
      console.log('Manual crowd data update completed');
    } catch (error) {
      console.error('Error in manual crowd data update:', error);
      throw error;
    }
  }

  // スケジューラーの状態を取得
  getStatus(): { isRunning: boolean; intervalMinutes?: number } {
    return {
      isRunning: this.isRunning,
      intervalMinutes: this.intervalId ? 15 : undefined // デフォルト15分
    };
  }
}

// シングルトンインスタンス
const crowdDataScheduler = new CrowdDataScheduler();

export default crowdDataScheduler; 