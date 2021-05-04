import { defineNuxtPlugin } from '@nuxtjs/composition-api'

declare module '@nuxt/types' {
  interface Context {
    $maps: { showMap: (canvas: HTMLElement, lat: number, lng: number) => void }
  }
}

export default defineNuxtPlugin((context, inject) => {
  let mapLoaded = false
  let mapWaiting: {
    canvas: HTMLElement
    lat: number
    lng: number
  } | null = null

  const addScript = () => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${context.$config.googleApiKey}&libraries=places&callback=initMap`
    script.async = true
    ;(window as any).initMap = initMap
    document.head.appendChild(script)
  }
  const initMap = () => {
    mapLoaded = true
    if (mapWaiting) {
      const { canvas, lat, lng } = mapWaiting
      renderMap(canvas, lat, lng)
      mapWaiting = null
    }
  }
  const showMap = (canvas: HTMLElement, lat: number, lng: number) => {
    if (mapLoaded) {
      renderMap(canvas, lat, lng)
    } else {
      mapWaiting = { canvas, lat, lng }
    }
  }
  const renderMap = (canvas: HTMLElement, lat: number, lng: number) => {
    const mapOptions = {
      zoom: 18,
      center: new window.google.maps.LatLng(lat, lng),
      disableDefaultUI: true,
      zoomControl: true,
    }
    const map = new window.google.maps.Map(canvas, mapOptions)
    const position = new window.google.maps.LatLng(lat, lng)
    const marker = new window.google.maps.Marker({
      position,
    })
    marker.setMap(map)
  }

  addScript()
  inject('maps', {
    showMap,
  })
})
