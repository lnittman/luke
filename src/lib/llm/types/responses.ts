import { Project } from '@/utils/constants/projects';
import { ProjectDocuments } from './project';

/**
 * Project generation response
 */
export interface ProjectGenerationResponse {
  project: Project;
  documents: ProjectDocuments;
} 