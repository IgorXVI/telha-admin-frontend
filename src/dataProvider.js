import { fetchUtils } from 'react-admin'

const apiUrl = 'http://localhost:4000/graphql'
const httpClient = fetchUtils.fetchJson

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const nameFun = (name, resource) => `${name}${capitalize(resource)}`

const getAttrs = resource => resource === "product" ?
    `{
        id
        createdAt
        updatedAt
        executionStart
        executionEnd
        size
        quantity
        machineId
    }`
    : `{
        id
        createdAt
        updatedAt
    }`

const makeGraphqlParams = query => [
    apiUrl,
    {
        method: 'POST',
        body: JSON.stringify({
            query
        }),
    }
]

const convertJSONToFilter = (json, keepNumbers = false) => `{${Object
    .keys(json)
    .map(key => `${key}: ${
        keepNumbers === true && !isNaN(json[key]) ?
            `${json[key]}`
            : `"${json[key]}"`
        }`)
    .join(",\n")}}`

export default {
    getList: (resource, params) => {
        console.log("findMany")
        
        const { page, perPage } = params.pagination
        const { field, order } = params.sort

        const sort = `{ ${field}: ${order.toUpperCase()} }`

        const filter = convertJSONToFilter(params.filter)

        const funName = nameFun("findMany", resource)

        const query = `{
            ${funName}(options: {
                order: ${sort},
                where: ${filter},
                take: ${perPage},
                skip: ${(page - 1) * perPage}
            }) {
                total
                elements ${getAttrs(resource)}
            }
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({
            data: json.data[funName].elements,
            total: json.data[funName].total
        }))
    },

    getOne: (resource, params) => {
        console.log("findOne")

        const funName = nameFun("findOne", resource)

        const query = `{
            ${funName}(id: "${params.id}") ${getAttrs(resource)}
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({
            data: json.data[funName],
        }))
    },

    getMany: (resource, params) => {
        console.log("findManyByIds")

        const funName = nameFun("findManyByIds", resource)
        const ids = JSON.stringify(params.ids)

        const query = `{
            ${funName}(options: {
                where: {
                    ids: ${ids}
                }
            }) {
                ${getAttrs(resource)}
            }
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({
            data: json.data[funName],
        }))
    },

    getManyReference: (resource, params) => {
        console.log("findMany reference")

        const { page, perPage } = params.pagination
        const { field, order } = params.sort

        const sort = `{ ${field}: ${order.toUpperCase()} }`

        const filter = convertJSONToFilter({
            ...params.filter,
            [params.target]: params.id,
        })

        const funName = nameFun("findMany", resource)

        const query = `{
            ${funName}(options: {
                order: ${sort},
                where: ${filter},
                take: ${perPage},
                skip: ${(page - 1) * perPage}
            }) {
                total
                elements ${getAttrs(resource)}
            }
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({
            data: json.data[funName].elements,
            total: json.data[funName].total
        }))
    },

    update: (resource, params) => {
        console.log("updateOne")

        const funName = nameFun("updateOne", resource)

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                id: "${params.id}"
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({ data: json[funName] }))
    },

    updateMany: (resource, params) => {
        console.log("updateMany")

        const funName = nameFun("updateMany", resource)
        const ids = JSON.stringify(params.ids)

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                ids: "${ids}"
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({ data: json[funName] }))
    },

    create: (resource, params) => {
        console.log("create")

        const funName = nameFun("create", resource)

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({
            data: json[funName],
        }))
    },

    delete: (resource, params) => {
        console.log("deleteOne")

        const funName = nameFun("deleteOne", resource)

        const query = `mutation {
            ${funName}(
                id: "${params.id}"
            )
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({ data: json[funName] }))
    },

    deleteMany: (resource, params) => {
        console.log("deleteMany")

        const funName = nameFun("deleteMany", resource)
        const ids = JSON.stringify(params.ids)

        const query = `mutation {
            ${funName}(
                ids: ${ids}
            )
        }`

        return httpClient(...makeGraphqlParams(query)).then(({ json }) => ({ data: json[funName] }))
    }
}