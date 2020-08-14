/* compact way of setting PI = Math.PI & so on... */
Object.getOwnPropertyNames(Math).map(function(p) {
    window[p] = Math[p]
  });
  /* oh, why? because I',m lazy, that's why! :P */
  
  
  
  
  
  /*
   * =============================================
   * GLOBALS
   * =============================================
   */
  var N_PARTICLES = 128, 
      
      c = document.querySelector('.c') /* canvas elem */, 
      w /* canvas width */, h /* canvas height */, 
      ctx = c.getContext('2d') /* get canvas context */,
      confettis = [],
      particles = [], 
      source = {} /* particle fountain source */, 
      t = 0, 
      req_id = null;
  
  
  
  
  
  /*
   * =============================================
   * OBJECTS USED
   * =============================================
   */
  var Particle = function(i) {
    var confetti /* current confetti piece */, 
        pos /* current particle position */, 
        v /* current particle velocity */, 
        a /* current particle acceleration */, 
        c_angle /* confetti particle angle */,
        angle_v /* angle velocity */,
        /* delay when shooting up 
         * so that they don't go all up at the same time
         * randomly generated
         */
        delay = rand(N_PARTICLES, 0, 1);
    
    /* active = was already shot up, but hasn't landed yet */
    this.active = false;
    
    /*
     * make particle active and give it a velocity so that 
     * it can start moving
     */
    this.shoot = function(ctx) {
      var angle, angle_var, val, 
          hue = rand(360, 0, 1);
      
      /* check if time for shooting this particle has arrived */
      if(t - delay >= 0) {
        /* make it active */
        this.active = true;
        
        /* choose our confetti */
        confetti = confettis[floor(random() * confettis.length)];
  
        /* position it at the fountain source, 
         * but a bit lower, depending on its radius
         */
        pos = { 'x': source.x + rand(-10, 10), 'y': source.y };
        
        /*
         * give it an acceleration considering gravity
         * and uniform friction (depending on its radius)
         */
        a = { 'x': 0, 'y': .4 };
        
        /* generate a random angle at which it shoots up */
        angle = rand(PI/8, -PI/8) - PI/2;
        
        /* Set up our confetti particle angle */
        c_angle = 0;
           angle_v = rand(-30, 30);
        
        /* generate random velocity absolute value in that direction */
        val = rand(h/21, h/60);
        
        /* compute initial velocity components */
        v = {
          'x': val*cos(angle), 
          'y': val*sin(angle)
        };
      }
    };
    
    /*
     * particle is in motion, update its velocity and position
     */
    this.motionUpdate = function() {
      /*
       * velocity_incr = acceleration * time_incr
       * position_incr = velocity * time_incr
       * but time_incr = 1 in our case
       * (see the t++ line in drawOnCanvas)
       * so compute new velocity and position components
       * based on this
       */
      v.x += a.x;
      v.y += a.y;
      pos.x += round(v.x);
      pos.y += round(v.y);
      c_angle += angle_v;
  
      /* if it has landed = it's below canvas bottom edge */
      if(pos.y > h | pos.x < 0 | pos.x > w) {
        /* reset position to the initial one */
        pos = { 'x': source.x, 'y': source.y };
        /* ... and make this particle inactive */
        this.active = false;
      }
    };
    
    this.draw = function(ctx) {
      ctx.save(); 
      
      ctx.translate(pos.x, pos.y);
      ctx.rotate(c_angle * Math.PI / 180);
  
      ctx.drawImage(confetti, -(confetti.width/2), -(confetti.height/2));
  
      ctx.restore(); 
      
      /* update its velocity and position */
      this.motionUpdate();
    };
  }
  
  
  
  
  
  /*
   * =============================================
   * FUNCTIONS
   * =============================================
   */
  
  /* 
   * generates a random number in the [min, max) interval
   * max: upper boundary for generated number; 
   *      defaults to 1
   * min: lower boundary for generated number; 
   *      defaults to 0
   * _int: flag specifying if generated number 
   *       should be rounded to the nearest integer
   *       falsy by default
   */
  var rand = function(max, min, _int) {
    var max = (max === 0 || max)?max:1, 
        min = min || 0, 
        gen = min + (max - min)*random();
    
    return (_int)?round(gen):gen;
  };
  
  
  /* Load up some confetti! */
  var loadConfetti = function() {
    confetti_orange = new Image;
    confetti_orange.src = "data:image/png;base64,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";
    confettis.push(confetti_orange);
    
    confetti_blue = new Image;
	confetti_blue.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAALXElEQVR4nO2ceWwc9RXHP7O31/bu2llf5HRCDjshiclFEwIJR1tiJaKUVhwtAYRawT+lVG1VqUWtkFpU1Kr3BS1/cPXgKKi0DUEFQpoCCTlIHBxyEBICCfGxa3u95+xUb2ac2Bmvs5PsJI7kr7S2NfPm/Wa++37v937vvbFCEfjNzGKkbGEG8FlgJTAecJkXdwDbgU3AO8DBUg56zx7LoYLwFDrhIL4A3KDBlVqeBs2kRMmfGHCFy8V1wDbgEWDjebjHE9/UucDlwMsK/LUnw029WRryg0aXv/MaZDP4473M7UuzVoHXgb8BLeeamHNlMXcp8IdkDqVHhekhD03VzbRUN8HBY9DTD42TIeylrzrHO0f3smfvNo50Q0U5Nwa8rNY07gIet2h2COeCmAcV+HY8A+EAfH7Cp5gUXQSeEGQykE+D5gVfLYyLUrFgMku9q1l67DDvbvk3r27dQLwffzjIY5pGBPiVZQQH4C5GZWvUcqhY3KrATzvTMCXi5o7pNxGuXggpFXIJyGeg8zjkMhCphAovVPshl4KKcdTMWMii2gbee38zHb1Q5mcVsNv82MaLncVf4aSPEZ/yuFhKY8TLzTO/CoFGSHQBaVBGWhAV6I9DfwxmL+fOW++nIeIi1q9f9hdgnuWSEsNJYn6UzkG5H25pvAFcVZCO6c9cFIS4fB5ix2DiLG5vvZtyFyQzuoYfXqjEtCqwLJ6D6ydcBhUzIRM/jZWMgPhxmHkZrYuW0WtYjUyphYUvOHs4RcyN8QzK1LDChJpFkOwDNIuQDu2Uv4cT0/KgZpm6oJXJ1Qr9Kf3oVyxyJYQTxIQlqpV4bU54JrhCkE9ZhHToFqRBLgu5vBHIuJVhyFEg2Qs1E7lk2lz6DHWXU/zEtA0niLk0n6e+3Act0dl6xDbsFBL/4XZDtBo8PvC7oSEMHpdxbjh5YOr4Zn3Zz6lMBy6xyJUIThBzEQOKXUHLySHI5aCqGpqnw4JGmFQN2WFIwbSubJpIVT2VAVDzegw2xyJXIjhBjB4biVsgp53e2NU8VAQhHDSsQrPMo5OQ82XluqGZUtUWmRLBCWJGeLICyKnGp5grXW5DzJD1Wc6XCE4Q45hDPDGA4yM4SIwimj1F7TiKh0v8TMqYpgY5cQfuX4cTxByRH7L6ovaaLsf+7LJAfI+vjMQnH9KdMBYvYIdFrkRwgpgtLheH0iqsO7IB0glQSzCMLOmdx3h9+zp9D+pxs8VMZjkCJ4iJSWrSm4edPR0wIQG+IPSrRgBnF2IpGVVfjcgdY+ehDir9uo5XxSYvJGLqgStzaVjSfDFcOxWWuKAhAJLHTOWHfpKa8TurDv8RYiSik+uvXUnLomZ6Dc9ynZOrkhOJqgV5lYZAGSxfutI4MkXoCkK3+fAMWrskjvF6YHId+MohnzupSQzMoxhbdPkKg5UsXrGKd7fuJptlttfLEoz0Z8nhBDF6WkuCMII+IyhLAF4V6hVQvEOlNRXckqAqM4nJnHJeyNOMYDHRR2j8RCpDEBO/7mX2hUSM7kh0d6LmYGBpzSmQw7pCCXEe04+IwHD7pMGaPV49jjG1nGbPceYYHZGvLe3a4AFGYPHscC7LJxcUxogpgDFiCmCMmAIYI6YAxogpgDFiCmCMmAIYI6YAxogpgDFiCsAJYmw0W5w1Ek4pLjUxkqRqtRx1DrOK7fGxi1IRMw34iSSns1nuSaUgLlk2VTUy+6WC3hqikuiFZL+e1fia2d35TWDcaCPmXkVhl5rjvs5OakVhtM7NqmvmQihitJOVCmpWz+LNXdRCbR1kk7i7OmjOq/xYUfSKwdpSDXU2fb41isKjeZXWWI/eBsaiBTNYvHAxvokToCxgdDFkcyNXyCSVKRWA+tngqxia2hwOUrByuSDWwSdt29i5cR3b3tqr58DCEX2oX2oa3wCyp15tp893hDs+iWGIqZP+27zKxd0xmN8UpXX1GpQ5zXpBjFRaN3mjuHQa2CVG4PXqmTzKK/RuiviGdax/8re07+mlKqrztt70dUPIsUPMmTQn+hSFdTmVuR1dsObqS7ji9ttQLqqDeAySaSM9WWypRMqKLjdU1ILbZ3YDnAaiX6wx0aePE2iaT/OSFahH29jX3oE/wDSXmwnA84MV2WlOPBNiHtDg5s4uuP6qOcxfuxbyWejtM86ONG2Gw5kQMwDTGesEVUdpXHYtHNlFe9tRAmW0KAo9wBsD4k52bS5TFL7T1QUrFk9i/q03Q6oPvffrXFTaC0HGjnXqU2z5vd9n3oIGYt364Z+a7y3Yhl1i7u9PQlUIrlxzPbjy55+UAYhTjnVB1ThW33EfleWQNlrSvmeRLQJ2iFkAfFr86qprroDJEyHeOzpIGYCsVl0dsHAZV3zmKhI9+sz8Euj1J3uqLEcK44uy8o6rgsZ5c40ISxmFWy3xOckk81auZlwNUrEU3GCROw2KfbIaYLn410tnz4a6OsikLUKjAmLB/QmYPI0ZTU0Dt7nEKWJk6WuSQaprolAePFmDHo2QCmh5JdObWsR4BIvNZyg5MbOyOSrDFVAViRhebTT5llMhHRIeL8G6BqNtOK9bfKNFbgQUS8zcXA53JCwWU2f07o52qDmC5REqKw0DMnf+JSdG70MRp4/7AsltaXlcLkW/ZzNk9FpkRkCxT3lUBpB0gppImD0eoxxuL6lMSvcxZr9ezAliNvs8JDu64fDHR8AXsAiMRqS6O0gkweXRN9+HnCDmiOLiE4ljssmUGb842+1xVhCLTiXpOHRA34gD7wLv21FZLDHC9rZQCHbvaYPOTgj4LUKjBpKS6O5k586NlJXpN7XJbn64WGIkTHo2WAbvHYiTe/8DZPs6Yt//+YLcUyhM9/Y3+HB/Pz7j+3vJ7t3YWWJeALqk5X/9a+uNnjjv+XiffQQIKZK86uvltRefICOvP3k4LO97F75oeNghRtLbD4UqYMuO43Rveh3CVaPH1wgp4luC5Rx8+o+07ehAYlHgB6DnZWzBblDyc7eHfcFyeOq5f8HudojWWIRsIxiEUJX+9Z7R9NQjXQ/U1JPd8BIvPPk0wZB+5k3gMYt8EbBLTFLTuKe8DHoS8OvfPQJ790E0amwR7DyUyEpppaaO5LatfPjCn6GywpgKdvX4AzopqVde5JGHHtBb6svK9CX6NuCMwvQzSW0ekOU7GGCNpGN2bd/CjFAIf+MUCASM7YLkewvtpQZMPhzSV4/uTW/x6OPPsXnjDqpSx6htmif1F0Ou0GuDA3pkvKpxeonmo+ef4olf/IxE2qgWaBq3ABsGX+J0zlewVYPOYIBVff3w5pbdKF0fM6kqgl7wkd23ohm5XPfAxwU+L4QMQjhwkA3P/Z1n//FfCcDENbB98z5ibf+h1hugrG481NaD12dcL1NFghJZZmTqiX/LpMm8/T9e+f2D/POZl3H5ocIwuLuGm0J2iCnwdQzFMOWTAVynKDycyTK+t8f4LwTNs6bSOGMaU6bNAFnfT7wH4YZEP/vfa+fg/v3sbv9Az5+bPEmccSyv8rm+HqN7d/qsKI3zL2PKlJlE6i8ynlhuN5Ugefw4+w+0c3jXFnbvOqTX9CrDup4NmsZ9wNuWOz1HdaXBkDzHdxWF23NZ/N1xCPqhukq644eq17IaUl1Iyr9yiOirfZ+m8SfgW2asdLei8HVNY7qUeDV54JBhIGJV4pNEh+zZemLG2z6ix+XmqKbxsFQwhiu0nS9iBiBSXwauzqu0ZFX8p/pQcRdeNymX8a7Ry6a5HzhFT9BMRd6p5ZmWU5k0+B1S0SE5FreHjxQXbcAzEnwCxy13dArOFzED+polaS6lFtOaBqJAWSUOmy9FSCTabrl6KKRRYCqw1Hy/OmquouIp9pqOtc3OHsgOMWMYgw0A/wdES9SH/P1PkwAAAABJRU5ErkJggg==";
	confettis.push(confetti_blue);

	confetti_purple = new Image;
	confetti_purple.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEuklEQVRIie2Xe4hUdRTHP/PamTvvcWcfY6O7q+KsILG+ktWEBB/5DE2JooS0/tA/q7+KKKIIQ4KC+iewMoINKSSwBwTSkoSymi1tPlaqFcZZncfOa+dxn3HnuuXOnd3Ngeifvsz88fvNOed7zrnnMddCHd6P1d8YsFhA1bAlKxxQbOxtcRASM4xbVb5tm8cJu42qqpnU/sKRq9PPdpNEA1gtUJZYmJEZ3BDp7Fpj7cFVUhC3LWAo/fOjZ89dPyp42OR3c1FRzfqNYKu/2BE2ySAqzMsq/PTsogeiK3oP4KoEsedbcO7cTc/GR+hzKMK5yyOHNPjcYSdpMgCcTk8/W00SddCfRVLkzV3RZZ3Rrj1QKUBlHKQJSI5BNkng4UM8tmm7PZvjLW2WdN8TcVnGF3Gzf2XHeqgWQSmDzQF2m/EVK5BOsGj1Vnrms2OyTLfJSDPEVZXFrS4hhM0LUhFEGZwCrF0G7T6oylDOgydEV+cSimX6TEaaIa5BtYCmi96Vx6AXHLZaqaPn12qHFheais+k3wyx3UoyL5UkJlIgOkDRQNKgJIKsGr5YnJAYIzk+iiAwYjLSDLEL4mmRuLR0Ejq8oN5par3HLHq0Kvg94JWJ56olwcENk5FGAZlu6lAssbwr6uh2bO4FEUh5QalAWwg6oyBWwe2E0Dp6v1viHvr++upwhG9Mhu6VGA27Ra/eih6+Bp16JVshYAePq5aSWuI0O07Bg6zQarLRFLHeyKpqFJEesag/Y9VwQlZAUowxpCggy7q8ZLLRAP+sqv8F/E88DbVVqEKlqhhtNCMstY8kyqgKmsW0bM2YkdhqhcwEm2+n+MTncdYmybTJNQ1azUuny0G6zBupW+zW9WdzoOFa1JXiCY5HI9a3Dz+zq33lpm3GQpBkQ0iVQAiCNwyqbIxMWab7/rU8uKqrNRUfefy3a9XlviAnp8jnXIs66c0Ex/pivqcPvvIywS1bwe/9m3QmVCswL0xg/yGe+OALNjwU25cY42OduFHkJuJCgVWdrTy/9/ARCATg9zEolRtrT8udDSYLcHUEBC9bXnuHpTHHgUyS7Y0ekIk4n+XJ9RvXwcIoJMbBZhKZHboD8RsQuY/+fQcRCzxVzGH6J2eyKnhY0dPdBdWqkfdmoJPnsiyOLSfUQX8xR//cxAIdPsGt90ZzpFMQRXAJ2N24LYp5R5uIiwVuTBRy4HIZ1doMdD3BTTWfo5zlttVOYk5iSeKHK1evgc0+e0GZNO+CTuzzMzp8nlyGM94Qg3Oqh1o5fvbMcFkZ/gUWLjCGw92R66OspQU65oM/ZJynftfuyC6JwfBFBgc+wx/mQ7eX2/U8pgGyJ0KhMEn61+ELO9d0R2FpDFocYLXVCoC2MOQKXDk5QCjYhrVvDThd4GipeU1HBIbPc+LFI8Rvyq+GOxjQfasfICbi7a3g9TKUSnPr3I8XdgYKCdo1mzEgMhOkLl3gy5MDnPpqbOiPi18LgUJCCFYlrIUs8uhlrpz6iE+PHuNWQn4psoDX9TWto554xncnvX0nS3Sn0zzn97FF8NCmyFQzGS45Bd5rD3M6n6V3IskLgQD9gpdwqcB4Ps9gqI13fQFGp0h11L87/TcA/gQD27p+ANEFXgAAAABJRU5ErkJggg==";
	confettis.push(confetti_purple);
  };
  
  
  
  
  /*
   * initializes a bunch of basic stuff
   * like canvas dimensions, 
   * default particle source, 
   * particle array...
   */
  var initCanvas = function() {
    var s = getComputedStyle(c);
    
    /* stop animation if any got started */
    if(req_id) {
      particles = [];
      cancelAnimationFrame(req_id);
      req_id = null;
      t = 0;
    }
    
    /* 
     * set canvas width & height
     * don't forget to also set the width & height attributes
     * of the canvas element, not just the w & h variables
     */
    w = c.width = ~~s.width.split('px')[0];
    h = c.height = ~~s.height.split('px')[0];
    
    /* set an inital source for particle fountain */
    source = { 'x': round(w/2), y: h };
    /* create particles and add them to the particle array */
    for(var i = 0; i < N_PARTICLES; i++) {
      particles.push(new Particle(i));
    }
    source.x = document.body.clientWidth * 0.5;
    source.y = document.body.clientHeight * 0.45;
    drawOnCanvas();
    
  };
  
  
  /*
   * goes through the particle array and
   * may call a particle's draw function
   */
  var drawOnCanvas = function() {
      ctx.clearRect ( 0 , 0 , w, h );
  
    
    /* go through each particle in the particle array */
    for(var i = 0; i < N_PARTICLES; i++) {
      if(particles[i].active) {// if it's active
        particles[i].draw(ctx); // draw it on canvas
      }
      else { // if not...
        if(t < 100){
        particles[i].shoot(ctx); // try to make it shoot up
        }
      }
    }
    
    t++; /* time increment */
    
    /**/
    req_id = requestAnimationFrame(drawOnCanvas);
    /**/
    
  };
  
  
  
  
  
  /*
   * =============================================
   * START IT ALL
   * =============================================
   */
  
  /* Pull in our confetti */
  loadConfetti();
  
  /* 
   * inside the setTimeout so that 
   * the dimensions do get set via CSS before calling 
   * the initCanvas function
   */

document.querySelector('#round').addEventListener('click', (e) => {
    setTimeout(() => {
        initCanvas();
    }, 8000);

})