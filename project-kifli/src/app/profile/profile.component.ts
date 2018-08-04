import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials} from '../model/credentials';
import { BrowserModule } from '@angular/platform-browser'; 
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

@NgModule({
    imports: [     
      BrowserModule,
      HttpClientModule,
    ]
  }) 

export class ProfileComponent implements OnInit {
  profile;
  userId: String;
  userName: String;
  userEmail: String;
  userFirstName: String;
  userLastName: String;
  phone: String;
  country: String;
  state: String;
  city: String;
  street: String;
  newPassword: String;

  constructor(
    private http: HttpClient) {}

  ngOnInit() {
    this.getUser();
    console.log(this.newPassword);
  }

  
  public getUser() {
     
    let userString = localStorage.getItem("user");
    let userObject = JSON.parse(userString);
    this.userId = userObject.id;
    this.userName = userObject.username;
    this.userEmail = userObject.email;
    this.userFirstName = userObject.firstName;
    this.userLastName = userObject.lastName;
    let credentials = userObject.credentials;
    this.phone = credentials.phone;
    this.country = credentials.country;
    this.state = credentials.state;
    this.city = credentials.city;
    this.street = credentials.street;
  }

  submit(newPassword1, newPassword2) {
    if(newPassword1.value === newPassword2.value) {  
    console.log("New PAss OK " + newPassword1.value);
    } else {
      console.log("New pass not the same")
    }
  }

  /*addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('addHero', hero))
      );
  } */

  /*doPOST() {
    console.log("POST");
    let url = `api/change-password`;
    this.http.post(url, {moo:"foo",goo:"loo"}).subscribe(res);
  }*/

}
