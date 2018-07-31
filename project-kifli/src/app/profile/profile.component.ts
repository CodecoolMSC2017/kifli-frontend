import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials} from '../credentials';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile;
  userName: String;
  userEmail: String;
  userFirstName: String;
  userLastName: String;
  phone: String;
  country: String;
  state: String;
  city: String;
  street: String;

  constructor() {
  }

  ngOnInit() {
    this.getUser();
  }

  public getUser() {
     
    let userString = localStorage.getItem("user");
    let userObject = JSON.parse(userString);
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

}
