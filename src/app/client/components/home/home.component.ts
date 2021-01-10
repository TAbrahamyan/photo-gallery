import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {
  username: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/user/me', {
      headers: new HttpHeaders({ token: localStorage.getItem('token') }),
    })
      .subscribe(
        (data: any): void => {
          this.username = data.username;
        },
        (error: HttpErrorResponse): void => {
          if (error.status === 500) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
