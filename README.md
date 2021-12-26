[![Stargazers][stars-shield]](https://github.com/salehsargolzaee/social-network/stargazers)
[![Issues][issues-shield]](https://github.com/salehsargolzaee/social-network/issues)
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/salehsargolzaee/social-network">
    <img src="https://res.cloudinary.com/salehsrz/image/upload/v1640544385/logo_xuznxs.png" alt="Logo" width="140" height="140">
  </a>

<h3  align="center">IRIS</h3>

  <p align="center">
    This is a node.js social network powered by Express that provides some functions you'd expect from a simple social network.
     <br />
      .
     <br />
    <a href="#demo">Demo GIF</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#demo">Demo</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

### Features

* Register
* Profile edit
* Create post
* Upload image
* Like 
* Comment
* Delete post (for admin and user who created the post)
* Edit post (for user who created the post)
* Real-Time post render
* Follow and unfollow
* Search other users



### Built With

* [Next.js](https://nextjs.org/)
* [React.js](https://reactjs.org/)
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com)
* [Material UI](https://mui.com/)
* [Ant Design](https://ant.design/)

### Demo

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Install npm.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/salehsargolzaee/social-network
   ```
2. Cd to client folder and run (to install NPM packages)
   ```sh
   npm install
   ```
3. Cd to server folder and run (to install NPM packages)
   ```sh
   npm install
   ```
4. Cd to server folder and create `.env` file, then enter following information
   ```
      DATABASE=mongodb+srv://your/db/url
      PORT=8000
      JWT_SECRET=your-secret

      CLOUDINARY_NAME=your-cloudinary-name
      CLOUDINARY_KEY=your-cloudinary-key
      CLOUDINARY_SECRET=your-cloudinary-secret

      CLIENT_URL=http://localhost:3000
   ```
5. Cd to client folder and create `.env.local` file, then enter following information
   ```
      NEXT_PUBLIC_API=http://localhost:8000/api
      NEXT_PUBLIC_SOCKETIO=http://localhost:8000
   ```
6. Cd to server folder and run
     ```sh
   npm start
   ```
7. Cd to client folder and run
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Saleh Sargolzaee - [@linkedin_handle](https://linkedin.com/in/saleh-sargolzaee-819ba119a) - salehsargolzaee@gmail.com

Project Link: [https://github.com/salehsargolzaee/social-network](https://github.com/salehsargolzaee/social-network)

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
[stars-shield]: https://img.shields.io/github/stars/salehsargolzaee/social-network.svg?style=for-the-badge
[stars-url]: https://github.com/salehsargolzaee/social-network/stargazers
[issues-shield]: https://img.shields.io/github/issues/salehsargolzaee/social-network.svg?style=for-the-badge
[issues-url]: https://github.com/salehsargolzaee/social-network/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/saleh-sargolzaee-819ba119a
[product-screenshot]: images/screenshot.png
