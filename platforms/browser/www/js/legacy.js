
// $(document).on('click', '[action="navigateBack"]', function(e){
//     app.navigate.back();
// });
// $(document).on('click', '[action="viewDebtor"]', function(e){
//     app.navigate.to('views/debtor/view.html', function(e){
//
//     });
// });
// $(document).on('click', '[action="sync"]', function(e){
//     $('item[action="sync"] > .icon').addClass('syncing');
//     $('.planning-list').html('');
//     setTimeout(function(e){
//         app.sync.start(function(e){
//             app.navigate.to('views/index.html');
//         });
//     }, 500);
// });
// $(document).on('click', '[action="viewAppointment"]', function(e){
//     var day = $(this).attr('day');
//     var appointment = $(this).attr('appointment');
//     Day.find().findById(day, function(result){
//         app.day = result;
//         app.dayIndex = day;
//         app.appointmentIndex = appointment;
//         app.appointment = result.data[appointment];
//         app.navigate.to('views/appointment/index.html');
//     });
// });

// $(document).on('click', '[action="viewCheckpoints"]', function(e){
//     app.navigate.to('views/checkpoints/index.html');
// });

// $(document).on('click', '[action="viewRemarks"]', function(e){
//     app.navigate.to('views/remarks/index.html');
// });
// $(document).on('click', '[action="remarkAdd"]', function(e){
//     app.navigate.to('views/remarks/create.html');
// });

// $(document).on('click', '[action="viewCheckpoint"]', function(e){
//     var checkpoint = $(this).attr('checkpoint');
//     app.checkpoint = app.appointment.checkpoints[checkpoint];
//     app.checkpointIndex = checkpoint;
//     if(app.checkpoint){
//         app.navigate.to('views/checkpoints/view.html');
//     }
// });

// $(document).on('click', '[action="completeAppointment"]', function(e){
//
//     var appointment = app.appointment;
//
//     var join = [];
//     var finished = true;
//
//     for(var i in appointment.checkpoints){
//         var sp = appointment.checkpoints[i];
//         if(sp.unreachable == true){
//
//         } else {
//             for(var q in sp.questions){
//                 var spq = sp.questions[q];
//                 if(spq.required === true && spq.answered !== true){
//                     join.push(spq.question);
//                     finished = false;
//                 }
//             }
//         }
//     }
//
//     if(finished){
//         // alert('COMPLETD');
//         app.navigate.to('views/installations/index.html');
//     } else {
//         join = join.join('\n');
//         alert('Er zijn nog openstaande vragen: \n' + join)
//     }
// });


// $(document).on('click', '[action="checkpointMarkUnreachable"]', function(e){
//     if(confirm("Weet u zeker dat u dit punt wilt markeren als onbereikbaar?")){
//         app.appointment.checkpoints[app.checkpointIndex].unreachable = true;
//         app.day.update(function(e){
//             app.navigate.to('views/checkpoints/index.html', function(e){
//
//             });
//         });
//     }
// });
// $(document).on('click', '[action="checkpointMarkReachable"]', function(e){
//     if(confirm("Weet u zeker dat u dit punt wilt markeren als bereikbaar?")){
//         app.appointment.checkpoints[app.checkpointIndex].unreachable = false;
//         app.day.update(function(e){
//             app.navigate.to('views/checkpoints/index.html', function(e){
//
//             });
//         });
//     }
// });
// $(document).on('click', '[action="checkpointEditName"]', function(e){
//     var cp = app.appointment.checkpoints[app.checkpointIndex];
//     var newname = prompt("Wijzigen naam: " + cp.name);
//     if(newname){
//         console.log(newname);
//         cp.name = newname;
//         app.day.update(function(e){
//             app.navigate.to('views/checkpoints/view.html', function(e){
//
//             });
//         });
//     }
//
// });

// $(document).on('click', '[action="signAppointment"]', function(e){
//     var appointment = app.appointment;
//
//     var errors = [];
//
//     for(var serviceTypeIndex in appointment.service_types){
//         var st = appointment.service_types[serviceTypeIndex];
//
//         if(st.state == null){
//             errors.push("Servicetype " + st.name + " heeft geen status!");
//         } else if(st.state == st.additional_questions.on){
//             for(var serviceTypeQuestionIndex in st.additional_questions.questions){
//                 var additionalQuestion = st.additional_questions.questions[serviceTypeQuestionIndex];
//                 if(additionalQuestion.required == true && additionalQuestion.answered == true){
//
//                 } else {
//                     errors.push("Openstaande vraag: " + additionalQuestion.question);
//                 }
//             }
//         }
//     }
//
//     for(var checkpointIndex in appointment.checkpoints){
//         var cp = appointment.checkpoints[checkpointIndex];
//         if(cp.unreachable == true){
//
//         } else {
//             for(var questionindex in cp.questions){
//                 var question = cp.questions[questionindex];
//                 if(question.required == true && question.answered == true){
//
//                 } else {
//                     errors.push("Openstaande vraag: " + question.question);
//                 }
//             }
//         }
//     }
//
//     if(errors.length == 0){
//         app.appointment.completed = true;
//         app.day.update(function(e){
//             app.navigate.to('views/signature/index.html', function(e){
//
//             });
//         });
//     } else {
//         alert(errors.join("\n"));
//     }
// });

// $(document).on('click', '[action="moreShow"]', function(e){
//     var list = $(this).find('.more-list');
//
//     if(list.hasClass('hidden')){
//         list.removeClass('hidden');
//     } else {
//         list.addClass('hidden');
//     }
// })

// $(document).on('click', '[action="remarkMarkComplete"]', function(e){
//     var index = $(this).attr('remark');
//     if(app.appointment.remarks[index]){
//         var remark = app.appointment.remarks[index];
//         remark.completed = true;
//         app.day.update(function(e){
//             app.navigate.to('views/remarks/index.html', function(e){
//
//             });
//         });
//     }
// });
// $(document).on('click', '[action="remarkMarkIncomplete"]', function(e){
//     var index = $(this).attr('remark');
//     if(app.appointment.remarks[index]){
//         var remark = app.appointment.remarks[index];
//         remark.completed = false;
//         app.day.update(function(e){
//             app.navigate.to('views/remarks/index.html', function(e){
//
//             });
//         });
//     }
// });



// $(document).on('click', '[action="signatureReset"]', function(e){
//     if(signaturePad){
//         signaturePad.clear();
//     }
// });
// $(document).on('click', '[action="signatureSubmit"]', function(e){
//
// });
