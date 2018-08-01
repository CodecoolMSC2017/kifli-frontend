import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTitleInput = new Subject<string>();
  public lastValue: string;

  constructor() { }

  searchTitle$ = this.searchTitleInput.asObservable();

  searchTitleApply(search: string) {
    this.lastValue = search;
    this.searchTitleInput.next(search);
  }
}
