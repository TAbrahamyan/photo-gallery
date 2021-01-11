import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiPaths } from '../../enums/ApiPaths';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  username: string;
  headers: HttpHeaders = new HttpHeaders({
    token: localStorage.getItem('token'),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.http.get(`${environment.baseUrl}/${ApiPaths.Me}`, { headers: this.headers })
      .subscribe(
        ({ username }: { username: string }): void => {
          this.username = username;
        },
        (error: HttpErrorResponse): void => {
          if (error.status === 500) {
            this.logout();
          }
        },
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
