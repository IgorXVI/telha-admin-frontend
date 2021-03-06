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

const errorHandler = json => {
    if (json.data === null) {
        throw new Error(json.errors[0].message)
    }
}

const convertJSONToFilter = (json, keepNumbers = false) => `{${Object
    .keys(json)
    .map(key => `${key}: ${
        keepNumbers === true && !isNaN(json[key]) ?
            json[key] instanceof Date ?
                `"${json[key].toISOString()}"`
                : `${json[key]}`
            : `"${json[key]}"`
        }`)
    .join(",\n")}}`

export default {
    getList: async (resource, params) => {
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

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName].elements,
            total: json.data[funName].total
        }
    },

    getOne: async (resource, params) => {
        console.log("findOne")

        const funName = nameFun("findOne", resource)

        const query = `{
            ${funName}(id: "${params.id}") ${getAttrs(resource)}
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    getMany: async (resource, params) => {
        console.log("findManyByIds")

        const funName = nameFun("findManyByIds", resource)
        const ids = JSON.stringify(params.ids)

        const query = `{
            ${funName}(ids: ${ids}) ${getAttrs(resource)}
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    getManyReference: async (resource, params) => {
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

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName].elements,
            total: json.data[funName].total
        }
    },

    update: async (resource, params) => {
        console.log("updateOne")

        const funName = nameFun("updateOne", resource)

        delete params.data.id
        delete params.data.createdAt
        delete params.data.updatedAt
        delete params.data.machineId

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                id: "${params.id}"
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    updateMany: async (resource, params) => {
        console.log("updateMany")

        const funName = nameFun("updateMany", resource)
        const ids = JSON.stringify(params.ids)

        delete params.data.id
        delete params.data.createdAt
        delete params.data.updatedAt
        delete params.data.machineId

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                ids: "${ids}"
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    create: async (resource, params) => {
        console.log("create")

        const funName = nameFun("create", resource)

        const body = convertJSONToFilter(params.data, true)

        const query = `mutation {
            ${funName}(
                data: ${body}
            ) ${getAttrs(resource)}
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    delete: async (resource, params) => {
        console.log("deleteOne")

        const funName = nameFun("deleteOne", resource)

        const query = `mutation {
            ${funName}(
                id: "${params.id}"
            )
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    },

    deleteMany: async (resource, params) => {
        console.log("deleteMany")

        const funName = nameFun("deleteMany", resource)
        const ids = JSON.stringify(params.ids)

        const query = `mutation {
            ${funName}(
                ids: ${ids}
            )
        }`

        const { json } = await httpClient(...makeGraphqlParams(query))
        errorHandler(json)
        return {
            data: json.data[funName]
        }
    }
}