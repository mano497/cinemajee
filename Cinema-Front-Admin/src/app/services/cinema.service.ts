import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host = 'http://localhost:8086';
  public villes;

  constructor(private http: HttpClient) { }

  public getVilles(){
    return this.http.get(this.host+"/villes")
  }

  getCinemas(v) {
   return this.http.get(v._links.cinemas.href);
  }

  getSalles(c) {
   return this.http.get(c._links.salles.href);

  }
  getProjections(salle: any) {
    console.log(salle);
    let url = salle._links.projection.href.replace("{?projection}", "");
    return this.http.get(url+"?projection=p1");
  }
  getTicketsPLaces(p){
    let url = p._links.tickets.href.replace("{?projection}", "");
    return this.http.get(url+"?projection=ticketProj");
  }

  payerTickets(dataForm) {
    return this.http.post(this.host+"/payerTickets", dataForm);
  }
  //ShadowLight is here  //
  AddCity(nc: any, loc: any, ac: any, lac: any) {
    var postData ={ "name": nc,"longitude" : loc , "latitude" : lac,"altiude": ac};
    return this.http.post(this.host+"/villes", postData);
  }
  deleteCity(v) {
    console.log(v);
    return this.http.delete(v._links.ville.href);
  }
  UpCity(v, nc: any, loc: any, ac: any, lac: any) {
    var postData ={ "name": nc,"longitude" : loc , "latitude" : lac,"altiude": ac};
    return this.http.put(v._links.ville.href, postData);
  }

}
