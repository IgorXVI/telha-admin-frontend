import * as React from "react"
import { Admin, Resource } from 'react-admin'

import { UserList } from './users'
import { PostList, PostEdit, PostCreate} from './posts'
import Dashboard from './Dashboard'
import authProvider from './authProvider'
import dataProvider from "./dataProvider"

const App = () => (
    <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="product" list={UserList} />
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
    </Admin>
)

export default App