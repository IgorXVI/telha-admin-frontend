import * as React from "react"
import { 
    List, 
    Datagrid, 
    TextField, 
    ReferenceField, 
    EditButton, 
    Edit, 
    SimpleForm, 
    TextInput, 
    ReferenceInput, 
    SelectInput,
    Create,
    Filter,
    DateTimeInput
} from 'react-admin'

const ProductFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="Machine" source="machineId" reference="machine" allowEmpty>
            <SelectInput optionText="id" />
        </ReferenceInput>
    </Filter>
)

export const ProductList = props => (
    <List filters={<ProductFilter />} {...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="machineId" reference="machine">
                <TextField source="id" />
            </ReferenceField>
            <TextField source="size" />
            <TextField source="quantity" />
            <TextField source="executionStart" />
            <TextField source="executionEnd" />
            <TextField source="createdAt" />
            <TextField source="updatedAt" />
            <EditButton />
        </Datagrid>
    </List>
)

export const ProductEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="size" />
            <TextInput source="quantity" />
            <DateTimeInput source="executionStart" />
            <DateTimeInput source="executionEnd" />
        </SimpleForm>
    </Edit>
)

export const ProductCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="machineId" reference="machine">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <TextInput source="size" />
            <TextInput source="quantity" />
            <DateTimeInput source="executionStart" />
            <DateTimeInput source="executionEnd" />
        </SimpleForm>
    </Create>
)