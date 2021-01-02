var c, controller, player, loop, game, box;
var jumpforce = 20;
var speed = 0.5;
var gravity = 0.95;
var frictionX = 0.95;
var frictionY = 0.95;

c = document.querySelector('canvas').getContext('2d');
world = {
      columns:30,
      rows:5,
      tile_size:150,
      size:32,
    };
player = {
    height:32,
    jumping:true,
    width:32,
    x:((world.columns-4)*32)/2-16,
    old_x:144,
    x_velocity:0,
    y:0,
    old_y:0,
    y_velocity:0
};
box = {
    height:32,
    width:32,
    x:((world.columns-1)*32)/2-16,
    y:4*world.columns + 8
}


controller = {
    left:false,
    right:false,
    up:false,
    down:false,
    speed2:false,
    keyListener:function(event){
        var key_state = (event.type == 'keydown')?true:false;
        
        switch(event.keyCode) {
            case 37://de linker pijl
                controller.left = key_state;
            break;
            case 38://de omhoog pijl
                controller.up = key_state;
            break;
            case 39://de rechter pijl
                controller.right = key_state;
            break;
            case 40://de omlaag pijl
                controller.down = key_state;
            break;
            case 65://a
                controller.left = key_state;
            break;
            case 87://w
                controller.up = key_state;
            break;
            case 68://d
                controller.right = key_state;
            break;
            case 83://s
                controller.down = key_state;
            break;
            case 90://de z knop
                controller.speed2 = key_state;
            break;
        }  
    }
};


loop = function(){
    if(controller.up && !player.jumping && !controller.down && player.y_velocity == 0){
        player.y_velocity -= jumpforce;
        player.jumping = true;
    }
    
    if(controller.left && !controller.speed2){
        player.x_velocity -= speed;
    }else if(controller.left && controller.speed2){
        player.x_velocity -= speed*2;
    }
    
   if(controller.right && !controller.speed2){
        player.x_velocity += speed;
    }else if(controller.right && controller.speed2){
        player.x_velocity += speed*2;
    }
    
    if(controller.down){
        player.height = 16;
    }else{
        player.height = 32;
    }
    player.y_velocity += gravity;
    player.x += player.x_velocity;
    player.y += player.y_velocity;
    
    if(!controller.down){
    player.y_velocity *= frictionY;
    player.x_velocity *= frictionX;
    }else{
    player.x_velocity *= frictionX -0.1;
    player.y_velocity *= frictionY -0.15;
    }
    
    
    if((player.y > world.rows * 32 - 32)&& !controller.down){
        player.jumping = false;
        player.y = world.rows * 32 - 32;
        player.y_velocity = 0;
        controller.down = false;
    }else if((player.y > world.rows * 32 -16)&& controller.down){
        player.jumping = false;
        player.y = world.rows * 32-16;
        player.y_velocity = 0;
    }
    
    if(player.x > world.columns * 32){
        player.x = -32;
    }else if(player.x < -32){
        player.x = world.columns * 32;
    } 
    if(player.y < 0){
        player.y = 0 ;
        player.y_velocity = 0;
    }
    
    if (player.x < box.x + box.width &&
        player.x + player.width > box.x &&
        player.y < box.y + box.height &&
        player.y + player.height > box.y) {
            if(box.y + 32 > player.y && player.old_y <= box.y && player.y_velocity > 0){
                if(player.height == 32){
                    player.y = box.y - 32 + 0.001;   
                }else{
                    player.y = box.y - 16 + 0.001;   
                }
                player.jumping = false;                               
                player.y_velocity = 0;
            }
            else if(box.x + 32 > player.x && player.old_x <= box.x + 32 && player.x_velocity > 0){
                player.x_velocity = 0;
                player.x = box.x - 32 - 0.001;}
            else if(box.x - 32 < player.x && player.old_x >= box.x - 32 && player.x_velocity < 0){
                player.x_velocity = 0;
                player.x = box.x + 32 + 0.001;}
    }
     
    c.canvas.height = world.rows * 32;
    c.canvas.width = world.columns * 32;
    c.fillStyle = '#ffa500';
    c.fillRect(0,0,world.columns * 32,180);
    c.fillStyle = '#ff8c00';
    c.beginPath();
    c.rect(player.x, player.y, player.width, player.height);
    c.fill();
    c.fillStyle = '#ff6c00';
    c.beginPath();
    c.rect(box.x, box.y, box.width, box.height);
    c.fill();
    
    document.getElementById('isJumping').innerHTML = 'is jumping: '+player.jumping+' | ';
    document.getElementById('isChrouching').innerHTML = 'is chrouching: '+controller.down +' | ';
     document.getElementById('speed2').innerHTML = 'speed: '+controller.speed2+' | ';
    document.getElementById("xSpeed").innerHTML = 'player.x_velocity: '+ player.x_velocity.toFixed(2)+' | ';            
    document.getElementById("ySpeed").innerHTML = 'player.y_velocity: '+ player.y_velocity.toFixed(2)+' | ';   ;
  document.getElementById('cords').innerHTML = '('+(player.x/32).toFixed(0) +', '+(player.y/32).toFixed(0) + ')';
      document.getElementById('col').innerHTML = 'height: '+ player.height;
    //world.drawMap();
    window.requestAnimationFrame(loop);
    player.old_x = player.x;
    player.old_y = player.y;
}
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);

