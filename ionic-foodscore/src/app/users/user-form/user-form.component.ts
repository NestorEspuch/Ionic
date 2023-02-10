import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/user-service.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { sameEmail } from 'src/app/validators/sameEmail.validator';
import { User } from 'src/app/auth/interfaces/user.interface';


@Component({
  selector: 'fs-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly userServices: UsersService,
    private fb: NonNullableFormBuilder
  ) {}

  user!: User;

  formProfile!: FormGroup;
  nameControl!: FormControl<string>;
  emailControl!: FormControl<string>;

  formPassword!: FormGroup;
  passwordControl!: FormControl<string>;
  password2Control!: FormControl<string>;

  formAvatar!: FormGroup;
  avatarControl!: FormControl<string>;

  avatarName = '';

  ngOnInit(): void {
    this.route.data.subscribe((user) => {
      this.user = user['user'];
    });

    this.nameControl = this.fb.control(this.user.name, [Validators.required]);

    this.emailControl = this.fb.control(this.user.email, [
      Validators.required,
      Validators.minLength(4),
    ]);

    this.avatarControl = this.fb.control('', [Validators.required]);

    this.formProfile = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
    });

    this.formPassword = this.fb.group({
      password: (this.passwordControl = this.fb.control("", [
          Validators.minLength(4),
          Validators.required,
      ])),
      password2: (this.password2Control = this.fb.control("", [
          sameEmail(this.passwordControl),
          Validators.required,
      ])),
  });

    this.formAvatar = this.fb.group({
      avatar: this.avatarControl,
    });
  }

  changeAvatar(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      (this.avatarControl.value as string) = reader.result as string;
    });
  }

  saveProfile(): void {
    // Swal.fire({
    //   title: 'Do you want to edit the profile?',
    //   showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Edit',
    //   denyButtonText: `Don't edit`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     this.userServices
    //       .saveProfile(this.nameControl.value, this.emailControl.value)
    //       .subscribe({
    //         next: () => {
    //           Swal.fire('Profile saved!', '', 'success');
    //         },
    //         error: (e) =>
    //           Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: e,
    //             footer: '<a href="">Why do I have this issue?</a>',
    //           }),
    //       });
    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info');
    //   }
    // });
  }

  savePassword(): void {
    // Swal.fire({
    //   title: 'Do you want to edit the password?',
    //   showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Edit',
    //   denyButtonText: `Don't edit`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     this.userServices.savePassword(this.passwordControl.value).subscribe({
    //       next: () => {
    //         Swal.fire('Password saved!', '', 'success');
    //       },
    //       error: (e) =>
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oops...',
    //           text: e,
    //           footer: '<a href="">Why do I have this issue?</a>',
    //         }),
    //     });
    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info');
    //   }
    // });
  }

  saveAvatar(): void {
    // Swal.fire({
    //   title: 'Do you want to edit the avatar?',
    //   showDenyButton: true,
    //   showCancelButton: true,
    //   confirmButtonText: 'Edit',
    //   denyButtonText: `Don't edit`,
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     this.userServices.saveAvatar(this.avatarControl.value).subscribe({
    //       next: () => {
    //         Swal.fire('Avatar saved!', '', 'success');
    //       },
    //       error: (e) =>
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oops...',
    //           text: e,
    //           footer: '<a href="">Why do I have this issue?</a>',
    //         }),
    //     });
    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info');
    //   }
    // });
  }

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }
}
