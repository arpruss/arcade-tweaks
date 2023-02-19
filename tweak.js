ArcadeTweak = {}

ArcadeTweak.game = document.URL.split('/').pop()

// Foot Craz controller to USB adapter with Wii Outdoor Challenge (https://www.instructables.com/Playing-NES-Power-Pad-Games-in-Emulation/)
ArcadeTweak.footcraz = 
'<image_directories>'+
'            <device instance="cartridge" directory="/emulator/" />'+
'        </image_directories>'+
'        <input>'+
'           <port tag=":SWB" type="OTHER" mask="1" defvalue="1">'+
'                <newseq type="standard">'+
'                    KEYCODE_BACKSPACE OR KEYCODE_2'+
'                </newseq>'+
'            </port>'+
'            <port tag=":SWB" type="OTHER" mask="2" defvalue="2">'+
'                <newseq type="standard">'+
'                    KEYCODE_SPACE OR KEYCODE_1'+
'                </newseq>'+
'            </port>'+
'            <port tag=":joyport1:joy:JOY" type="P1_JOYSTICK_UP" mask="1" defvalue="1">'+
'                <newseq type="standard">'+
'                    KEYCODE_S'+
'                </newseq>'+
'            </port>'+
'            <port tag=":joyport1:joy:JOY" type="P1_JOYSTICK_DOWN" mask="2" defvalue="2">'+
'                <newseq type="standard">'+
'                    KEYCODE_D'+
'                </newseq>'+
'            </port>'+
'            <port tag=":joyport1:joy:JOY" type="P1_JOYSTICK_LEFT" mask="4" defvalue="4">'+
'                <newseq type="standard">'+
'                    KEYCODE_A'+
'                </newseq>'+
'            </port>'+
'            <port tag=":joyport1:joy:JOY" type="P1_JOYSTICK_RIGHT" mask="8" defvalue="8">'+
'                <newseq type="standard">'+
'                    KEYCODE_F'+
'                </newseq>'+
'            </port>'+
'            <port tag=":joyport1:joy:JOY" type="P1_BUTTON1" mask="32" defvalue="32">'+
'                <newseq type="standard">'+
'                    KEYCODE_W'+
'                </newseq>'+
'            </port>'+
'        </input>'

ArcadeTweak.tweaks = {
    'arcade_blstroid': 
        { 
            system: 'blstroid',
            config: '<input><port tag=":DIAL0" type="P1_DIAL" mask="255" defvalue="0" sensitivity="24" /></input>',
            controller: '',
        },
    'atari_2600_video_reflex_foot_craz_1983_exus_corporation':
        {
            system: 'a2600',
            config: '',
            controller: ArcadeTweak.footcraz,
        },
    'atari_2600_video_jogger_foot_craz_1983_exus_corporation':
        {
            system: 'a2600',
            config: '',
            controller: ArcadeTweak.footcraz,
        }
}

ArcadeTweak.options=['-paddle_device','mouse','-dial_device','mouse','-trackball_device','mouse','-positional_device','mouse','-lightgun_device','mouse','-keepaspect'];

ArcadeTweak.wrap = function(system, xml) {
    return '<mameconfig version="10"><system name="'+system+'">'+xml+'</system></mameconfig>'       
}

ArcadeTweak.go = function() {
    if (typeof MAMELoader === 'undefined')
        return;
    
    var options = ArcadeTweak.options;
    var tweaks = ArcadeTweak.tweaks[ArcadeTweak.game];
    if (tweaks) {
        console.log("Tweaking",ArcadeTweak.game)
        if (tweaks.options)
            options = options.concat(tweaks.options);
        if (tweaks.controller) {
            options = options.concat('-ctrlrpath','/');
            options = options.concat('-ctrlr','/controller');
        }
        if (tweaks.config) {
            options = options.concat('-cfg_directory','/');
        }
    }
    else {
        console.log("No specific tweak for",ArcadeTweak.game);
    }

    if (tweaks && (tweaks.controller || tweaks.config) && ! ArcadeTweak.BrowserFS_initialize) {
        var patched = false;
        console.log("patching BrowserFS.initialize");
        ArcadeTweak.BrowserFS_initialize=BrowserFS.initialize;
        BrowserFS.initialize=function(z){
          console.log("initialize called");
          var r=ArcadeTweak.BrowserFS_initialize(z);
          ArcadeTweak.FS_mkdir=FS.mkdir;
          FS.mkdir=function(d){
              var r=ArcadeTweak.FS_mkdir(d);
              if (!patched && d=="/artwork") {
                if (tweaks.controller)
                    FS.writeFile('/controller.cfg',ArcadeTweak.wrap(tweaks.system,tweaks.controller));
                if (tweaks.config)
                    FS.writeFile('/'+tweaks.system+'.cfg',ArcadeTweak.wrap(tweaks.system,tweaks.config));
                patched = true;
              }
              return r;
          }
          return r;
        };
    }

    console.log("patching MAMELoader.extraArgs");
    MAMELoader.extraArgs=(z)=>({extra_mame_args:options});
}

ArcadeTweak.go();
