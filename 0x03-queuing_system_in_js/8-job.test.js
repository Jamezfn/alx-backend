import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
	let queue;

	beforeEach(() => {
		queue = kue.createQueue();
		queue.testMode.enter();
	});

	afterEach(() => {
		queue.testMode.clear();
		queue.testMode.exit();
	});

	it('display a error message if jobs is not an array', () => {
		expect(() => createPushNotificationsJobs('tt', queue)).to.throw(Error, 'Jobs is not an array');
	});

	it('create two new jobs to the queue', () => {
		const jobs = [
			{ phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
			{ phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
		];

		createPushNotificationsJobs(jobs, queue);

		const queuedJobs = queue.testMode.jobs
                expect(queuedJobs).to.have.lengthOf(2);

		expect(queuedJobs[0].type).to.equal('push_notification_code_3');
		expect(queuedJobs[0].data).to.deep.equal(jobs[0]);

		expect(queuedJobs[1].type).to.equal('push_notification_code_3');
		expect(queuedJobs[1].data).to.deep.equal(jobs[1])
        });
});
