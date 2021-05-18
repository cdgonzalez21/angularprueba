import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tarea } from '../model/tarea';
import { Observable } from 'rxjs';
import * as $ from 'jquery'

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _http: HttpClient) {}

  // Obtiene las cabeceras por defecto
  private getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }
  
   // GET method to get ranking
   getAvailability(): any {
    // tslint:disable-next-line:max-line-length
    const url = `https://608adc0d737e470017b7410f.mockapi.io/api/v1/todos`;
    return this._http.get(url, { headers: this.getHeaders() });
  }

  insertBase(base: tarea): Observable<any> {
    const url = `https://608adc0d737e470017b7410f.mockapi.io/api/v1/todos `;    
    return this._http.post(url, base);
  }

  updateBase(base: tarea): Observable<any> {
    const url = `https://608adc0d737e470017b7410f.mockapi.io/api/v1/todos/`;    
    return this._http.put(url+base.id, base);
  }

  deleteBase(id: number): Observable<any> {
    const url = `https://608adc0d737e470017b7410f.mockapi.io/api/v1/todos/`;    
    return this._http.delete(url+id);
  }

}
