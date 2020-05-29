import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { GlobalService, roles } from '@services/index';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
  
export class BreadcrumbsComponent implements OnInit {
  role: string;
  breadcrumbs: Array<any> = [];

  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private globalS: GlobalService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.breadcrumbs = this.removeHomeRoutes(this.createBreadCrumb(this.activatedRoute.root));    });
  }

  ngOnInit(): void {
    const { role } = this.globalS.decode();
    if (role == roles.admin) {
      this.isAdmin = true;
    }
    this.role = role;
  }

  removeHomeRoutes(routes: Array<any>): Array<any> {
    let finalRoutes = [...routes];

    if (finalRoutes.length === 0) {
      return routes;
    }

    var removeIndexes = [];
    for (let route in routes) {
      const url = routes[route].label;
      if (url === 'admin' || url === 'landing') {
        removeIndexes.push(parseInt(route));
      }
    }

    for (var i = removeIndexes.length - 1; i >= 0; i--)
      finalRoutes.splice(removeIndexes[i], 1);

    finalRoutes.forEach(x => x.label = x.label.replace(/^\w/, c => c.toUpperCase()));

    return finalRoutes;
  }

  createBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<any> = []): Array<any> {
    const children: Array<ActivatedRoute> = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (var child of children) {
      const routeURL: string = child.snapshot.url.map(x => x.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      breadcrumbs.push({ label: routeURL, url: url })
      return this.createBreadCrumb(child, url, breadcrumbs);
    }
  }

  toHome() {
    if(this.role === roles.admin)
      this.router.navigate(['/admin/landing']);
    
    if (this.role === roles.client)
      this.router.navigate(['/client/profile']);
    
    if (this.role === roles.provider)
      this.router.navigate(['/provider/profile']);
  }

  show(route: any) {
    this.router.navigate([route.url]);
  }

}
