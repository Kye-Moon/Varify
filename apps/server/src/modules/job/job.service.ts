import {Injectable} from '@nestjs/common';
import {CreateJobInput} from './dto/create-job.input';
import {UpdateJobInput} from './dto/update-job.input';
import {JobRepository} from './job.repository';
import {RequestService} from '../request/request.service';
import {JobSearchInput} from './dto/search-job.input';
import {JobCrewService} from "../job-crew/job-crew.service";
import {UserRepository} from "../user/user.repository";
import {OrganisationRepository} from "../organisation/organisation.repository";
import {FormTemplateRepository} from "../form-template/form-template.repository";
import {JobFormService} from "../job-form/job-form.service";
import {mapResultsToIds} from "../../common/utils";
import {Job} from "gql-types";

@Injectable()
export class JobService {
    constructor(
        private readonly jobRepository: JobRepository,
        private readonly request: RequestService,
        private readonly jobCrewService: JobCrewService,
        private readonly userRepository: UserRepository,
        private readonly organisationRepository: OrganisationRepository,
        private readonly formTemplateRepository: FormTemplateRepository,
        private readonly jobFromService: JobFormService
    ) {
        console.log('JobService initialized');
    }

    async create(createJobInput: CreateJobInput) {
        const user = await this.userRepository.findOneByAuthId(this.request.userId);
        const org = await this.organisationRepository.findByAuthId(this.request.organisationId);
        const job = await this.jobRepository.createJob({
            ...createJobInput,
            ownerId: user.id,
            organisationId: org.id
        });
        if (createJobInput.crew && createJobInput.crew.length > 0) {
            await this.jobCrewService.createMany(job.id, createJobInput.crew);
        }

        const orgAutoAssignableForms = await this.formTemplateRepository.findAutoAssignable(org.id);
        const systemDefaultForms = await this.formTemplateRepository.findSystemDefaults();

        if(orgAutoAssignableForms.length > 0 || systemDefaultForms.length > 0){
            const autoAssignForms = [...orgAutoAssignableForms, ...systemDefaultForms];
            await this.jobFromService.createMany(autoAssignForms.map((form) => {
                return {
                    jobId: job.id,
                    formTemplateId: form.id
                }
            }));
        }

        return job;
    }

    /**
     * Search jobs
     * Currently only allows you to see jobs you own
     * @param searchInput
     */
    async search(searchInput: JobSearchInput) {
        const user = await this.userRepository.findOneByAuthId(this.request.userId);
        const org = await this.organisationRepository.findByAuthId(this.request.organisationId);

        const results = await this.jobRepository.search({
            ...searchInput,
            userId: user.id,
            organisationId: org.id
        });
        return results.map((result) => {
            return {
                ...result.job
            }
        });
    }

    async findOne(id: string) {
        //TODO - check if user has access to this job
        return await this.jobRepository.findOne(id);
    }

    async update(id: string, updateJobInput: UpdateJobInput) {
        const existingJob = await this.jobRepository.findOne(id);
        if (!existingJob) throw new Error('Job not found');
        const job = await this.jobRepository.update(id, updateJobInput);
        if (updateJobInput.crew){
            await this.jobCrewService.update(job.id, updateJobInput.crew);
        }
        return job;
    }

    async delete(id: string) {
        return await this.jobRepository.delete(id);
    }
    async findManyByProjectIds(projectIds: string[]) {
        const jobs = await this.jobRepository.findManyByProjectIds(projectIds);
        return jobs;
    }

    mapJobsToProjectIds = (projectIds,jobs: Job[]) => {}
}
