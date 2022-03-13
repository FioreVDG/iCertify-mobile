import { TestBed } from '@angular/core/testing';

import { DocumentLogsService } from './document-logs.service';

describe('DocumentLogsService', () => {
  let service: DocumentLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
