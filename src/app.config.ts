import { version } from '../package.json'
import type { AppConfig } from './framework/types'
export const appConfig: AppConfig = {
 id: 'physiks-materials-kadencsmith', title: 'Physiks · Materials', shortTitle: 'Physiks Materials',
 description: 'Four labs for ENGR330 · reason from the exam, one step at a time.', version,
 switcherLabel: 'Materials lab', documentationLabel: 'methods & sources', defaultSpeed: 1, defaultModelId: 'crystals',
}
