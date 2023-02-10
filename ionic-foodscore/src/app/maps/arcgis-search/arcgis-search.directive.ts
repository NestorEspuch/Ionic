import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import widgetsSearch from '@arcgis/core/widgets/Search';
import { ArcgisMapComponent } from '../arcgis-map/arcgis-map.component';
import { SearchResult } from '../interfaces/search-result';
import { LoadArcgisMapsService } from '../load-arcgis-maps.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'arcgis-search',
  standalone: true,
})
export class ArcgisSearchDirective implements OnInit {
  @Input() position = 'top-right';
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() result = new EventEmitter<SearchResult>();
  search!: widgetsSearch;

  constructor(
    private readonly map: ArcgisMapComponent,
    private readonly loadMaps: LoadArcgisMapsService
  ) {}

  ngOnInit(): void {
    this.map.mapViewLoad$.subscribe(
      mapView => {
        this.loadMaps.getSearch(mapView, this.position).then(
          search => {
            this.search = search;
            search.on("select-result", e => {
              const coords = e.result.feature.geometry;
              this.result.emit({
                address: e.result.name,
                latitude: coords.get("latitude"),
                longitude: coords.get("longitude")
              });
          });
          }
        );
      }
    )
  }


}
