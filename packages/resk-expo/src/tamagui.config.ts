import { config } from '@tamagui/config/v3'
import { createTamagui, TamaguiConfig, TamaguiInternalConfig } from 'tamagui' // or '@tamagui/core'

const appConfig: TamaguiInternalConfig = createTamagui(config as unknown as TamaguiConfig)

export type AppConfig = typeof appConfig

declare module 'tamagui' {
    // or '@tamagui/core'
    // overrides TamaguiCustomConfig so your custom types
    // work everywhere you import `tamagui`
    interface CustomTamaguiConfig extends AppConfig {

    }
}

export default appConfig