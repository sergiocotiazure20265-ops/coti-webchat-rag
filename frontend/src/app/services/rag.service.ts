import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RagRequest } from '../models/rag-request';
import { RagResponse } from '../models/rag-response';

@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/rag';
  perguntar(request: RagRequest): Observable<RagResponse> {
    return this.http.post<RagResponse>(this.endpoint, request);
  }
}
