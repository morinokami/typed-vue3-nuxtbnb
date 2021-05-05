import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { HomeType, ReviewType, UserType } from '~/types'

type AlgoliaResponseType<T> = {
  json: T
  ok: boolean
  status: number
  statusText: string
}

type GetHomeResponseType = HomeType
type GetReviewsByHomeIdResponseType = {
  hits: ReviewType[]
}
type GetUserByHomeIdResponseType = { hits: UserType[] }

declare module '@nuxt/types' {
  interface Context {
    $dataApi: {
      getHome: (
        homeId: string
      ) => Promise<AlgoliaResponseType<GetHomeResponseType>>
      getReviewsByHomeId: (
        homeId: string
      ) => Promise<AlgoliaResponseType<GetReviewsByHomeIdResponseType>>
      getUserByHomeId: (
        homeId: string
      ) => Promise<AlgoliaResponseType<GetUserByHomeIdResponseType>>
    }
  }
}

export default defineNuxtPlugin((context, inject) => {
  const appId = context.$config.algoliaAppId
  const apiKey = context.$config.algoliaAppKey
  const headers = {
    'X-Algolia-API-Key': apiKey,
    'X-Algolia-Application-Id': appId,
  }

  const unwrap = async <T>(
    response: Response
  ): Promise<AlgoliaResponseType<T>> => {
    const json = await response.json()
    const { ok, status, statusText } = response
    return {
      json,
      ok,
      status,
      statusText,
    }
  }

  const getErrprResponse = (error: Error) => {
    return {
      ok: false,
      status: 500,
      statusText: error.message,
      json: {},
    }
  }

  const getHome = async (homeId: string) => {
    try {
      return unwrap<GetHomeResponseType>(
        await fetch(
          `https://${appId}-dsn.algolia.net/1/indexes/homes/${homeId}`,
          { headers }
        )
      )
    } catch (error) {
      return getErrprResponse(error)
    }
  }

  const getReviewsByHomeId = async (homeId: string) => {
    try {
      return unwrap<GetReviewsByHomeIdResponseType>(
        await fetch(
          `https://${appId}-dsn.algolia.net/1/indexes/reviews/query`,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({
              filters: `homeId:${homeId}`,
              hitsPerPage: 6,
              attributesToHighlight: [],
            }),
          }
        )
      )
    } catch (error) {
      return getErrprResponse(error)
    }
  }

  const getUserByHomeId = async (homeId: string) => {
    try {
      return unwrap<GetUserByHomeIdResponseType>(
        await fetch(`https://${appId}-dsn.algolia.net/1/indexes/users/query`, {
          headers,
          method: 'POST',
          body: JSON.stringify({
            filters: `homeId:${homeId}`,
            attributesToHighlight: [],
          }),
        })
      )
    } catch (error) {
      return getErrprResponse(error)
    }
  }

  inject('dataApi', {
    getHome,
    getReviewsByHomeId,
    getUserByHomeId,
  })
})
