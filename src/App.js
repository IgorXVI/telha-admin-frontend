import * as React from "react"
import { Admin, Resource } from 'react-admin'

import { ProductList, ProductEdit, ProductCreate } from './products'
import { MachineList, MachineCreate } from './machines'
import Dashboard from './Dashboard'
import authProvider from './authProvider'
import dataProvider from "./dataProvider"

const App = () => (
    <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="product" list={ProductList} edit={ProductEdit} create={ProductCreate} />
        <Resource name="machine" list={MachineList} create={MachineCreate} />
    </Admin>
)

export default App