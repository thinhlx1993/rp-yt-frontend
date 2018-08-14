import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput, UploadStatus} from 'ngx-uploader';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, PageEvent} from '@angular/material';
import { emailUploadApi } from '../../global';
import 'rxjs-compat/add/operator/debounceTime';
import {UsersService} from './users.service';
import {EmailService} from '../email/email.service';

@Component({
  selector: 'fury-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

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
  usersPageIndex = 0;
  usersPageSize = 10;
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
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.search = new FormControl();
    this.getData();

    this.search.valueChanges.debounceTime(500).subscribe((searchText: string) => {
      this.usersPageIndex = 0;
      this.getData();
    });
  }

  getData() {
    this.usersService.getUsers(this.usersPageIndex, this.usersPageSize, this.search.value).subscribe((res: any) => {{
      if (res.status) {
        this.rows = res.data.rows;
        this.totals = res.data.totals;
      }
    }});
  }

  pageSizeChange(page?: PageEvent) {
    this.usersPageIndex = page.pageIndex;
    this.usersPageSize = page.pageSize;
    this.getData();
  }

  createUser () {
    this.dialog.open(CreateEditUserComponent, {
      disableClose: false,
      data: {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openEditDialog(user) {
    this.dialog.open(CreateEditUserComponent, {
      disableClose: false,
      data: user || {}
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openChangePasswordDialog(user) {
    this.dialog.open(ChangePasswordUserComponent, {
      disableClose: false,
      data: user
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  openDeleteDialog(user) {
    this.dialog.open(DeleteUserComponent, {
      disableClose: false,
      data: user
    }).afterClosed().subscribe(result => {
      this.refreshData(result);
    });
  }

  refreshData(command) {
    if (command === 'refresh') {
      this.usersPageIndex = 0;
      this.getData();
    }
  }

  clearData() {
    if (this.search.value !== '') {
      this.search.setValue('');
      this.usersPageIndex = 0;
      this.getData();
    }
  }


}


@Component({
  selector: 'fury-manage-user-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>{{title}}</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <mat-form-field>
            <input matInput type="text" placeholder="Tài khoản" formControlName="username" required>
          </mat-form-field>
          <mat-form-field *ngIf="state == 'addUser'">
            <input matInput type="password" placeholder="Mật khẩu" formControlName="password" required>
          </mat-form-field>
          <mat-form-field *ngIf="state == 'addUser'">
            <input matInput type="password" placeholder="Nhập lại mật khẩu" formControlName="confirm" required>
          </mat-form-field>
          <mat-form-field>
            <mat-select placeholder="Quền hạn" formControlName="role" required>
              <mat-option value="admin">Quản trị viên</mat-option>
              <mat-option value="user">Người dùng</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="text" placeholder="Họ và tên" formControlName="fullname">
          </mat-form-field>
          <div fxLayout="row" fxLayoutGap="1em" fxLayout.lt-md="column">
            <mat-form-field>
              <input matInput type="text" placeholder="Điện thoại" formControlName="phone">
            </mat-form-field>
            <mat-form-field>
              <input matInput type="text" placeholder="Địa chỉ" formControlName="address">
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

export class CreateEditUserComponent implements OnInit {
  form: FormGroup;
  title = '';
  state = 'addUser';
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateEditUserComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('_id')) {
      this.title = 'Chỉnh sửa thông tin cá nhân.';
      this.state = 'editUser';
      this.form = this.fb.group({
        _id: [this.data._id],
        username: [this.data.username, Validators.compose([Validators.maxLength(200), Validators.required])],
        fullname: [this.data.fullname, Validators.maxLength(200)],
        phone: [this.data.phone, Validators.maxLength(200)],
        address: [this.data.address, Validators.maxLength(200)]
      });
      this.form.controls['username'].disable();
    } else {
      this.title = 'Thêm người dùng';
      this.form = this.fb.group({
        username: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        confirm: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        fullname: ['', Validators.maxLength(200)],
        phone: ['', Validators.maxLength(200)],
        address: ['', Validators.maxLength(200)]
      });
    }
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (this.data.hasOwnProperty('_id')) {
      // edit user
      this.userService.editUser(this.form.value).subscribe((res: any) => {
        this.showMessage(res);
      });
    } else {
      if (this.form.controls['password'].value === this.form.controls['confirm'].value) {
        // create user
        this.userService.createUser(this.form.value).subscribe((res: any) => {
          this.showMessage(res);
        });
      } else {
        const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
          duration: 10000,
          panelClass: ['snackbar-error']
        };
        this.snackBar.open('Mật khẩu không khớp', '', snackBarConfig);
      }
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
  selector: 'fury-delete-user-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>Xóa người dùng: {{ data.username }}</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <p>Bạn có muốn xóa người dùng này không?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close('do nothing')">Không</button>
      <button mat-raised-button color="warn" (click)="deleteFile()">Đồng ý xóa</button>
    </mat-dialog-actions>
  `
})
export class DeleteUserComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(results) {
    this.dialogRef.close(results);
  }

  deleteFile() {
    this.userService.removeUser(this.data._id).subscribe((res: any) => {
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
    });
  }
}


@Component({
  selector: 'fury-change-password-dialog',
  template: `
    <div mat-dialog-title fxLayout="row" fxLayoutAlign="space-between center">
      <div>{{title}}</div>
      <button type="button" mat-icon-button (click)="close('do nothing')" tabindex="-1">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" (submit)="save()">
        <div class="login-content" fxLayout="column" fxLayoutAlign="start stretch">
          <mat-form-field>
            <input matInput type="text" placeholder="Tài khoản" formControlName="username" required>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="password" placeholder="Mật khẩu" formControlName="password" required>
          </mat-form-field>
          <mat-form-field>
            <input matInput type="password" placeholder="Nhập lại mật khẩu" formControlName="confirm" required>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <!--<button mat-button (click)="close()">Cancel</button>-->
      <button mat-raised-button color="accent" (click)="save()" [disabled]="form.invalid">Lưu</button>
    </mat-dialog-actions>
  `
})

export class ChangePasswordUserComponent implements OnInit {
  form: FormGroup;
  title = 'Thay đổi mật khẩu';
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ChangePasswordUserComponent>,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.hasOwnProperty('_id')) {
      this.form = this.fb.group({
        _id: [this.data._id],
        username: [this.data.username],
        password: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        confirm: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
      });
      this.form.controls['username'].disable();
    }
  }

  close(results) {
    this.dialogRef.close(results);
  }

  save() {
    if (this.data.hasOwnProperty('_id')) {
      if (this.form.controls['password'].value === this.form.controls['confirm'].value) {
        // edit user
        const json = {
          _id: this.data._id,
          password: this.form.controls['password'].value
        };

        this.userService.changePasswordUser(json).subscribe((res: any) => {
          this.showMessage(res);
        });
      } else {
        const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
          duration: 10000,
          panelClass: ['snackbar-error']
        };
        this.snackBar.open('Mật khẩu không khớp.', '', snackBarConfig);
      }
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
