import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput, UploadStatus} from 'ngx-uploader';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import { emailUploadApi } from '../../global';
import {EmailService} from './email.service';
import 'rxjs-compat/add/operator/debounceTime';

@Component({
  selector: 'fury-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  /**
   * Needed for uploader
   * @param {ManageService} manageService
   */
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  fileStatus = 'none';
  totals = 0;
  uploadPageIndex = 0;
  uploadPageSize = 10;
  rows = [];
  tableHover = false;
  tableStriped = true;
  tableCondensed = false;
  tableBordered = false;
  onPageSizeChange: boolean;
  uploading: boolean;
  dialogIsOpen: boolean;
  search: FormControl;
  lang: string;
  /**
   * Result of dialog module
   */
  result: string;
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  col(colAmount: number) {
    return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
  }

  constructor(
    private snackBar: MatSnackBar,
    private emailService: EmailService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.search = new FormControl();
    this.options = { concurrency: 1 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.getData();

    this.search.valueChanges.debounceTime(500).subscribe((searchText: string) => {
      this.uploadPageIndex = 0;
      this.getData();
    });
  }

  onUploadOutput(output: UploadOutput): void {
    console.log(output.type);
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: UploadInput = {
        type: 'uploadAll',
        url: emailUploadApi,
        method: 'POST',
        headers: {'Authorization': `Bearer ${localStorage.getItem('Auth-token')}`}
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      const exist = this.files.filter((file: any) => file.name === output.file.name);
      if (exist.length === 0) {
        this.files.push(output.file);
        this.startUpload(output.file);
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }


    this.fileStatus = 'added';
  }

  onUploading(): boolean {
    const fileOnUpload = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    return fileOnUpload.length !== 0;
  }

  checkUploading() {
    const fileOnUpload = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    if (fileOnUpload.length === 0) {
    } else {
      const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
        duration: 10000,
        panelClass: ['snackbar-error']
      };

      // Load setting of user
      const settings = JSON.parse(localStorage.getItem('settings'));
      const key = 'lang';
      let message = 'Bitte warten Sie auf alle hochgeladenen Dateien, um neue Dateien hinzuzufügen';
      if (settings.hasOwnProperty(key)) {
        if (settings['lang'] === 'en') {
          message = 'Please wait for all file uploaded to add new files';
        }
      }
      this.snackBar.open(message, '', snackBarConfig);
    }
  }

  startUpload(file): void {
    const event: UploadInput = {
      type: 'uploadFile',
      file: file,
      url: emailUploadApi,
      method: 'POST',
      headers: {'Authorization': `Bearer ${localStorage.getItem('Auth-token')}`}
    };
    this.uploadInput.emit(event);
  }

  pageSizeChange(page?: PageEvent) {
    this.uploadPageIndex = page.pageIndex;
    this.uploadPageSize = page.pageSize;
    this.getData();
  }

  sizeCalculator(size): string {
    return `${humanizeBytes(size)}`;
  }

  speedCalculator(speed): string {
    return `${humanizeBytes(speed)}/s`;
  }

  clearData() {
    if (this.search.value !== '') {
      this.search.setValue('');
      this.uploadPageIndex = 0;
      this.getData();
    }
  }

  getData() {
    this.emailService.getEmails(this.uploadPageIndex, this.uploadPageSize, this.search.value).subscribe((res: any) => {{
      if (res.status) {
        this.rows = res.data.rows;
        this.totals = res.data.totals;
      }
    }});
  }

  createEmail() {
    this.dialog.open(CreateEditEmailComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(row) {
    this.dialog.open(CreateEditEmailComponent, {
      disableClose: false,
      data: row || {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(row) {
    this.dialog.open(DeleteEmailComponent, {
      disableClose: false,
      data: row
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  refreshData(command) {
    if (command === 'refresh') {
      this.uploadPageIndex = 0;
      this.getData();
    }
  }
}

@Component({
  selector: 'fury-manage-email-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Quản lý email</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <mat-form-field>
            <input matInput type="text" placeholder="Email" formControlName="email" required>
          </mat-form-field>
          <div fxLayout="row" fxLayoutGap="1em" fxLayout.lt-md="column">
            <mat-form-field>
              <input matInput type="text" placeholder="Mail khôi phục" formControlName="recovery_email" required>
            </mat-form-field>
            <mat-form-field>
              <input matInput type="text" placeholder="Số điện thoại" formControlName="phone" required>
            </mat-form-field>
          </div>
          <div fxLayout="row" fxLayoutGap="1em" fxLayout.lt-md="column">
            <mat-form-field>
              <input matInput type="text" placeholder="Mật khẩu" formControlName="password" required>
            </mat-form-field>
            <mat-form-field>
              <input matInput type="text" placeholder="Ngày tạo" formControlName="date">
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <!--<button mat-button (click)="close()">Cancel</button>-->
      <button mat-raised-button color="accent" (click)="save()" [disabled]="form.invalid">Lưu</button>
    </mat-dialog-actions>
  `
})


export class CreateEditEmailComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditEmailComponent>,
    private emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (!this.data.hasOwnProperty('id')) {
      this.form = this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.maxLength(200), Validators.email]) ],
        password: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        recovery_email: ['', Validators.compose([Validators.required, Validators.maxLength(200), Validators.email])],
        date: ['', Validators.maxLength(200)],
        phone: ['', Validators.maxLength(200)]
      });
    } else {
      this.form = this.fb.group({
        id: [this.data.id],
        email: [this.data.email, Validators.compose([Validators.required, Validators.maxLength(200), Validators.email]) ],
        password: [this.data.password, Validators.compose([Validators.maxLength(200), Validators.required])],
        recovery_email: [this.data.recovery_email, Validators.compose([Validators.required, Validators.maxLength(200), Validators.email])],
        date: [this.data.date, Validators.maxLength(200)],
        phone: [this.data.phone, Validators.maxLength(200)]
      });
    }
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (!this.data.hasOwnProperty('id')) {
      // create email
      this.emailService.createEmail(this.form.value).subscribe((res: any) => {
        this.showMessage(res);
      });
    } else {
      // edit email
      this.emailService.editEmail(this.form.value).subscribe((res: any) => {
        this.showMessage(res);
      });
    }
  }

  showMessage(res: any) {
    if (res.status) {
      const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
        duration: 10000,

        panelClass: ['snackbar-success']
      };
      this.snackBar.open(res.message, '', snackBarConfig);
      this.dialogRef.close('refresh');
    } else {
      const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
        duration: 10000,
        panelClass: ['snackbar-error']
      };
      this.snackBar.open(res.message, '', snackBarConfig);
    }
  }
}


@Component({
  selector: 'fury-delete-email-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Xóa email: {{ data.email }}</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <p>Bạn có muốn xóa email này không?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close('do nothing')">Không</button>
      <button mat-raised-button color="warn" (click)="deleteFile()">Đồng ý xóa</button>
    </mat-dialog-actions>
  `
})
export class DeleteEmailComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteEmailComponent>,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(results) {
    this.dialogRef.close(results);
  }

  deleteFile() {
    this.emailService.removeEmail(this.data.id).subscribe((res: any) => {
      if (res.status) {
        const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
          duration: 10000,
          panelClass: ['snackbar-success']
        };
        this.snackBar.open(res.message, '', snackBarConfig);
        this.dialogRef.close('refresh');
      }
    });
  }
}
