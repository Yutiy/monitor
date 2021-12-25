import { FC, createContext } from 'react'
import { BaseClient } from '@bdw/monitor-core'
import { MitoContextValueType } from '../types'

export const MitoContext = createContext<MitoContextValueType>({} as any)
MitoContext.displayName = 'MotoContext'

export const MitoProvider: FC<MitoContextValueType> = ({ MitoInstance, children }: { MitoInstance: BaseClient; children: any }) => {
  return <MitoContext.Provider value={{ MitoInstance }}>{children}</MitoContext.Provider>
}
