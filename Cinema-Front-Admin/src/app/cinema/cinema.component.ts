import { Component, OnInit, NgModule } from '@angular/core';
import { CinemaService } from '../services/cinema.service';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.scss']
})
@NgModule({
  imports: [
    ReactiveFormsModule
  ],
})
export class CinemaComponent implements OnInit {

  constructor(public cinemaService: CinemaService,
              private formBuilder: FormBuilder,
              private router: Router ) { }
  public villes;
  public currentVille;
  public cinemas;
  public salles;
  public currentCinema;
  public currentProjection;
  public selectedTickets;
  public newCity: FormGroup;
  public upCity: FormGroup;
  public sendNc;
  public sendLoc;
  public sendAc;
  public sendLac;

  ngOnInit() {
    this.cinemaService.getVilles().subscribe(
      data => {
        this.villes = data;
        console.log(data);
      },
      err => {
        console.log(err);

      }
    );
    // shadow is here
    this.newCity = this.formBuilder.group({
        name_new_city: ['', [Validators.required]],
        longitude_new_city: ['', [Validators.required]],
        altitude_new_city: ['', [Validators.required]],
        latitude_new_city: ['', [Validators.required]]
    });
    this.upCity = this.formBuilder.group({
      name_up_city: ['', [Validators.required]],
      longitude_up_city: ['', [Validators.required]],
      altitude_up_city: ['', [Validators.required]],
      latitude_up_city: ['', [Validators.required]]
  });

  }
  addNewCity() {
    const nc = this.newCity.get('name_new_city').value;
    const loc = this.newCity.get('longitude_new_city').value;
    const ac = this.newCity.get('altitude_new_city').value;
    const lac = this.newCity.get('latitude_new_city').value;
    console.log('test');
    this.cinemaService.AddCity(nc, loc, ac, lac).subscribe(
      () => {
        document.location.reload(true);
      }
    );
  }
  UpdateCity(v) {
    // verification name
    if (this.upCity.get('name_up_city').value) {
      this.sendNc = this.upCity.get('name_up_city').value;

    } else {
      this.sendNc = v.name;
    }
    // verification longitude
    if (this.upCity.get('longitude_up_city').value) {
      this.sendLoc = this.upCity.get('longitude_up_city').value;

    } else {
      this.sendLoc = v.longitude;
    }
    // verification altitude
    if (this.upCity.get('altitude_up_city').value) {
      this.sendAc = this.upCity.get('altitude_up_city').value;

    } else {
      this.sendAc = v.altiude;
    }
    // verification latitude
    if (this.upCity.get('latitude_up_city').value) {
      this.sendLac = this.upCity.get('latitude_up_city').value;

    } else {
      this.sendLac = v.latitude;
    }

    // const loc = this.up_city.get('longitude_up_city').value;
    // const ac = this.up_city.get('altitude_up_city').value;
    // const lac= this.up_city.get('latitude_up_city').value;


    this.cinemaService.UpCity(v, this.sendNc , this.sendLoc, this.sendAc, this.sendLac).subscribe(
      () => {
        document.location.reload(true);
      }
    );
  }
  onDeletVille(v) {
    this.cinemaService.deleteCity(v).subscribe(
            () => {
              console.log('this would have removed', v);
              document.location.reload(true);
            },
            error => console.log(error));
  }
  // end shadow is here Add new city
  onGetCinema(v) {
    this.cinemaService.getCinemas(v).subscribe(
      data => {
        this.cinemas = data;
        this.salles = '';
        this.currentVille = v;
        console.log(this.currentVille);
      },
      err => {
        console.log(err);

      }
    );
  }
  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        console.log(data);
        this.salles._embedded.salles.forEach(
        salle => {
          console.log(salle);
          this.cinemaService.getProjections(salle)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(data => {
              salle.projections = data;
              console.log(data);
            }, err => {
              console.log(err);
            });
        });
      }, err => {
        console.log(err);
      });
  }

  onGetTicketsPlaces(p) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPLaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      }, err => {
        console.log(err);
      });
  }

  OnSelectTicket(t: any) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }

  getTicketClass(t) {
    let str = 'btn ticket ';
    if (t.reserve === true) {
      str += 'btn-danger';
    } else if (t.selected) {
      str += 'btn-light';
    } else {
      str += 'btn-outline-light';
    }
    return str;
  }

  onPayTickets(dataForm) {
    const tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data => {
        this.onGetTicketsPlaces(this.currentProjection);
      }, err => {
        console.log(err);
      });
  }
}
