import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { MarkerType } from '~/types'

declare module '@nuxt/types' {
  interface Context {
    $maps: {
      showMap: (
        canvas: HTMLElement,
        lat: number,
        lng: number,
        markers?: MarkerType[]
      ) => void
      makeAutoComplete: (input: HTMLInputElement) => void
    }
  }
}

export default defineNuxtPlugin((context, inject) => {
  let isLoaded = false
  let waiting: {
    fn: Function
    arguments: any[]
  }[] = []

  const addScript = () => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${context.$config.googleApiKey}&libraries=places&callback=initMap`
    script.async = true
    ;(window as any).initMap = initGoogleMaps
    document.head.appendChild(script)
  }

  const initGoogleMaps = () => {
    isLoaded = true
    waiting.forEach((item) => {
      if (typeof item.fn === 'function') {
        item.fn(...item.arguments)
      }
    })
    waiting = []
  }

  const makeAutoComplete = (input: HTMLInputElement) => {
    if (!isLoaded) {
      waiting.push({ fn: makeAutoComplete, arguments: [input] })
      return
    }

    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types: ['(cities)'],
    })
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', { detail: place }))
    })
  }

  const showMap = (
    canvas: HTMLElement,
    lat: number,
    lng: number,
    markers?: MarkerType[]
  ) => {
    if (!isLoaded) {
      waiting.push({
        fn: showMap,
        arguments: [canvas, lat, lng],
      })
      return
    }

    const mapOptions = {
      zoom: 18,
      center: new window.google.maps.LatLng(lat, lng),
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }
    const map = new window.google.maps.Map(canvas, mapOptions)
    if (!markers || markers.length === 0) {
      const position = new window.google.maps.LatLng(lat, lng)
      const marker = new window.google.maps.Marker({
        position,
        clickable: false,
      })
      marker.setMap(map)
      return
    }

    const bounds = new window.google.maps.LatLngBounds()
    markers.forEach((home) => {
      const position = new window.google.maps.LatLng(home.lat, home.lng)
      const marker = new window.google.maps.Marker({
        position,
        label: {
          text: `$${home.pricePerNight}`,
          className: `marker home-${home.id}`,
        },
        icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
        clickable: false,
      })
      marker.setMap(map)
      bounds.extend(position)
    })

    map.fitBounds(bounds)
  }

  addScript()
  inject('maps', {
    showMap,
    makeAutoComplete,
  })
})
