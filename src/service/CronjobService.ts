import { CronJob } from 'cron';
import { FastifyInstance } from 'fastify';

export default class CronJobService {
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  private fastify: FastifyInstance;

  start() {
    this.fastify.log.info('Cronjob iniciada');
    this.firstJob();
    this.secondJob();
  }

  private firstJob() {
    new CronJob('0 */1 * * * *', async () => {
      this.fastify.log.info('será executada a cada minuto');
    }).start();
  }

  private secondJob() {
    new CronJob('0 */2 * * * *', () =>
      this.fastify.log.info('será executada a cada 2 minutos')
    ).start();
  }
}
