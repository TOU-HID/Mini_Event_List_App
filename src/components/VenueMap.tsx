import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useAppTheme} from '../theme/theme';

interface VenueMapProps {
  latitude: number | null;
  longitude: number | null;
  venueName: string;
  description?: string;
  sectionTitle?: string;
}

const VenueMap: React.FC<VenueMapProps> = ({
  latitude,
  longitude,
  venueName,
  description,
  sectionTitle = 'Location',
}) => {
  const {colors} = useAppTheme();
  const hasCoordinates = latitude != null && longitude != null;

  const escapeHtml = useCallback((value: string) => {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }, []);

  const mapHtml =
    hasCoordinates && latitude != null && longitude != null
      ? `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { margin: 0; height: 100%; width: 100%; }
      .leaflet-control-attribution { font-size: 10px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const lat = ${latitude};
      const lng = ${longitude};
      const name = "${escapeHtml(venueName)}";
      const details = "${escapeHtml(description ?? '')}";

      const map = L.map('map', {
        zoomControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([lat, lng]).addTo(map);
      if (details) {
        marker.bindPopup('<b>' + name + '</b><br/>' + details);
      } else {
        marker.bindPopup('<b>' + name + '</b>');
      }
    </script>
  </body>
</html>`
      : '';

  const handleOpenInMaps = useCallback(() => {
    if (!hasCoordinates) {
      return;
    }

    const safeLatitude = latitude as number;
    const safeLongitude = longitude as number;
    const label = encodeURIComponent(venueName);

    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${safeLatitude},${safeLongitude}&q=${label}`
        : `geo:${safeLatitude},${safeLongitude}?q=${safeLatitude},${safeLongitude}(${label})`;

    Linking.openURL(url);
  }, [hasCoordinates, latitude, longitude, venueName]);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>
        {sectionTitle}
      </Text>
      {hasCoordinates ? (
        <>
          <View style={[styles.mapCard, {borderColor: colors.border}]}>
            <WebView
              style={styles.map}
              originWhitelist={['*']}
              source={{html: mapHtml}}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              setSupportMultipleWindows={false}
            />
          </View>

          <View style={styles.mapMetaRow}>
            <Text style={[styles.mapCoords, {color: colors.textMuted}]}>
              {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
            </Text>
            <TouchableOpacity
              onPress={handleOpenInMaps}
              activeOpacity={0.7}
              style={[
                styles.openMapButton,
                {backgroundColor: colors.surfaceAlt},
              ]}>
              <Text style={[styles.openMapButtonText, {color: colors.primary}]}>
                Open in Maps
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View
          style={[
            styles.mapUnavailable,
            {backgroundColor: colors.surfaceAlt, borderColor: colors.border},
          ]}>
          <Text style={[styles.mapUnavailableText, {color: colors.textMuted}]}>
            Map location is not available for this event.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  mapCard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    marginTop: 2,
  },
  map: {
    width: '100%',
    height: 180,
  },
  mapMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapCoords: {
    fontSize: 12,
  },
  openMapButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  openMapButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mapUnavailable: {
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  mapUnavailableText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default React.memo(VenueMap);
