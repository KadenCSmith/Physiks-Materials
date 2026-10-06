import type { SimulationDefinition } from './framework/types'
import { crystalsModel } from './models/crystals/model'
import { defectsModel } from './models/defects/model'
import { orderModel } from './models/order/model'
import { phasesModel } from './models/phases/model'
export const models: SimulationDefinition[] = [crystalsModel, defectsModel, orderModel, phasesModel]
// Retain standalone template examples for their existing regression tests only.
export { oscillatorModel } from './examples/oscillator'
export { relaxationModel } from './examples/relaxation'
