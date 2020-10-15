addCity(lng, lat, name)
    - draw pin with label
    - save city to inner DB

getNbCities()    
    return: amount of saved cities

addRoad(city_idx_1, city_idx_2)
    - draw line between cities (color1)
    - save link (city_idx_1 <-> city_idx_2) to DB

getNbRoads(city_idx)
    return: amount of roads where city_idx_1 == city_idx or city_idx_2 == city_idx

getCityRoads(city_idx)
    return: roads where city_idx_1 == city_idx or city_idx_2 == city_idx

getCityLongitude(city_idx)    
    return: city lng

getCityLatitude(city_idx)    
    return: city lat

getRoadLength(road_idx)
    return: distance between cities linked by given road

highlightRoad(road_idx)
    - draw line between cities (color2)
    
getDestinationCity(city_idx, road_idx)
    return: find all roads where city_idx_1 == city_idx or city_idx_2 == city_idx, take road with index = road_idx, return another city idx from road link


TODO:
+remove earth3d renderer
+2 modes for pin: short (2chars) and full length
grading: mark mistake on the map with red circle (centered in the middle of the road when it's a road)
+display an error "Road already exists" if user add existing road