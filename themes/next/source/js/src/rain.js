
    (function () {
        var drops = [], bounces = [];
        //�����趨�������ٶ�Ϊ0.2/һ֡
        var gravity = 0.2;


        var speed_x_x, //������ٶ�
                speed_x_y, //������ٶ�
                wind_anger;  //����
        //���������ؿ��
        var canvasWidth,
                canvasHeight;
        //����drop�ļ���
        var drop_chance;
        //���ö���
        var OPTS;
        //�ж��Ƿ���requestAnimationFrame�������������ʹ�ã�û�����Լһ��30֡(�󲿷ֵ��������ʾƵ����16.7ms)
        window.requestAnimFrame =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 30);
                };
        var Vector = function(x, y) {
            //˽������  �����ٶ�x ,�����ٶ�y
            this.x = x || 0;
            this.y = y || 0;
        };
        //���з���- add : �ٶȸı亯��,���ݲ������ٶȽ�������
        //����ҵ�����󣬿��ǵĶ���������ٵ��������û�м��ٵģ����ڿ���չ
        /*
         * @param v  object || string
         */
        Vector.prototype.add = function(v) {
            if (v.x != null && v.y != null) {
                this.x += v.x;
                this.y += v.y;
            } else {
                this.x += v;
                this.y += v;
            }
            return this;
        };
        //���з���- copy : ����һ��vector������������֮ǰ�ٶȽڵ�ļ�¼
        Vector.prototype.copy = function() {
            //����һ��ͬ���ٶ����Ե�Vectorʵ��
            return new Vector(this.x, this.y);
        };
        //���캯�� Drop

        var Drop = function() {
            //�������drop�ĳ�ʼ����
            //�������ѡ����������Ǵ���һ��
            var randomEdge = Math.random()*2;
            if(randomEdge > 1){
                this.pos = new Vector(50 + Math.random() * canvas.width, -80);
            }else{
                this.pos = new Vector(canvas.width, Math.random() * canvas.height);
            }

            //��������Ԫ�صĴ�С
            //ͨ�����õ�OPTS�����İ뾶��Χ�������ȡֵ
            this.radius = (OPTS.size_range[0] + Math.random() * OPTS.size_range[1]) *DPR;

            //���drop��ʼ�ٶ�
            //ͨ�����õ�OPTS�������ٶȷ�Χ�������ȡֵ
            this.speed = (OPTS.speed[0] + Math.random() * OPTS.speed[1]) *DPR;

            this.prev = this.pos;
            //���Ƕȳ��� 0.017453293 ��2PI/360������ת��Ϊ���ȡ�
            var eachAnger =  0.017453293;
            //��÷���ĽǶ�
            wind_anger = OPTS.wind_direction * eachAnger;
            //��ú�����ٶ�
            speed_x =  this.speed * Math.cos(wind_anger);
            //���������ٶ�
            speed_y = - this.speed * Math.sin(wind_anger);

            //��һ���ٶ�ʵ��
//        this.vel = new Vector(wind_x, wind_y);
            this.vel = new Vector(speed_x, speed_y);

        };
        Drop.prototype.update = function() {

            this.prev = this.pos.copy();
            //�������������������������ٶȽ�������
            if (OPTS.hasGravity) {
                this.vel.y += gravity;
            }
            //
            this.pos.add(this.vel);
        };
        Drop.prototype.draw = function() {

            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
//Ŀǰֻ��Ϊ���������һ����rain  ������������
            if(OPTS.type =="rain"){
                ctx.moveTo(this.prev.x, this.prev.y);
                var ax = Math.abs(this.radius * Math.cos(wind_anger));
                var ay = Math.abs(this.radius * Math.sin(wind_anger));
                ctx.bezierCurveTo(this.pos.x + ax, this.pos.y + ay, this.prev.x + ax , this.prev.y + ay, this.pos.x, this.pos.y);
                ctx.stroke();

                //��һ����snow--��Բ��
            }else{
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
                ctx.fill();
            }
        };
        var Bounce = function(x, y) {

            var dist = Math.random() * 7;
            var angle = Math.PI + Math.random() * Math.PI;

            this.pos = new Vector(x, y);
            this.radius =  0.2+ Math.random()*0.8;
            this.vel = new Vector(
                    Math.cos(angle) * dist,
                    Math.sin(angle) * dist
            );
        };

        Bounce.prototype.update = function() {

            this.vel.y += gravity;

            this.vel.x *= 0.95;
            this.vel.y *= 0.95;

            this.pos.add(this.vel);
        };

        Bounce.prototype.draw = function() {

            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius*DPR, 0, Math.PI * 2);
            ctx.fill();

        };
        function update() {

            var d = new Date;
            //����ͼ
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var i = drops.length;
            while (i--) {

                var drop = drops[i];

                drop.update();
                //���dropʵ���½����ײ�������Ҫ��drops�����������ʵ������
                if (drop.pos.y >= canvas.height) {
                    //�����Ҫ�ص�������bouncess�����м���bounceʵ��
                    if(OPTS.hasBounce){
                        var n = Math.round(4 + Math.random() * 4);
                        while (n--)
                            bounces.push(new Bounce(drop.pos.x, canvas.height));
                    }
                    //���dropʵ���½����ײ�������Ҫ��drops�����������ʵ������
                    drops.splice(i, 1);
                }

                drop.draw();
            }
            //�����Ҫ�ص�
            if(OPTS.hasBounce){
                var i = bounces.length;
                while (i--) {
                    var bounce = bounces[i];
                    bounce.update();
                    bounce.draw();
                    if (bounce.pos.y > canvas.height) bounces.splice(i, 1);
                }
            }
            //ÿ�β���������
            if(drops.length < OPTS.maxNum){
                if (Math.random() < drop_chance) {
                    var i = 0,
                            len = OPTS.numLevel;
                    for(; i<len; i++){
                        drops.push(new Drop());
                    }
                }

            }
            //����ѭ��update
            requestAnimFrame(update);
        }
        function init(opts) {
            OPTS = opts;
            canvas = document.createElement("canvas");
            canvas.id = opts.id,
canvas.setAttribute("style", "position:fixed; top: 0; left: 0; z-index: 2222; pointer-events: none;"),
//        canvas = document.getElementById(opts.id);
                    ctx = canvas.getContext("2d");

            ////���ݸ�����Ļ��canvas��������ҲҪ��Ӧ�ı�
            DPR = window.devicePixelRatio;

            //canvas�������ش�С�� ����ݸ�����Ļ���ʻ���canvas����Ӧ�ó���DPR
            canvasWidth = canvas.clientWidth * DPR;
            canvasHeight =canvas.clientHeight * DPR;

            //���û�����
            canvas.width = window.screen.width ;
            canvas.height = window.screen.height;

            document.getElementsByTagName("body")[0].appendChild(canvas);
            drop_chance = 0.4;
            //������ʽ
            setStyle();
        }

        function setStyle(){
            if(OPTS.type =="rain"){
                ctx.lineWidth = 1 * DPR;
                ctx.strokeStyle = 'rgba(223,223,223,0.6)';
                ctx.fillStyle = 'rgba(223,223,223,0.6)';

            }else{
                ctx.lineWidth = 2 * DPR;
                ctx.strokeStyle = 'rgba(254,254,254,0.8)';
                ctx.fillStyle = 'rgba(254,254,254,0.8)';
            }
        }
        init({
            id:"canvas",
            maxNum:200,
            numLevel:20,
            type: "rain",  // drop���ͣ���rain or snow
            speed : [0.4,2.5], //�ٶȷ�Χ
            size_range: [0.5,1.5],//��С�뾶��Χ
            /*    speed : [0.4,2.5], //�ٶȷ�Χ
             size_range: [5.5,10.5],//��С�뾶��Χ*/
            hasBounce: true, //�Ƿ��з���Ч��or false,
            wind_direction: -105, //�Ƕ�
            hasGravity: true //�Ƿ�����������
        });
        update();
    })()