import * as React from "react"
import { 
    List, 
    Datagrid, 
    TextField, 
    SimpleForm, 
    TextInput, 
    Create,
    Filter
} from 'react-admin'

const MachineFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
)

export const MachineList = props => (
    <List filters={<MachineFilter />} {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="createdAt" />
            <TextField source="updatedAt" />
        </Datagrid>
    </List>
)

export const MachineCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
        </SimpleForm>
    </Create>
)